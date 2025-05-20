<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\FaceDataService;
use App\Services\IdentityDocumentService;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    protected $documentService;
    protected $faceDataService;
    protected $userService;

    public function __construct(
        IdentityDocumentService $documentService,
        FaceDataService $faceDataService,
        UserService $userService
    ){
        $this->documentService = $documentService;
        $this->faceDataService = $faceDataService;
        $this->userService = $userService;
    }

    /**
     * Verification du document d'identité
    */
    public function verifyDocument(Request $request){
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|max:2048',
            'document_type' => 'required|string|in:id_card,passport,driver_license'
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()],422);
        }

        $documentData = $this->documentService->processDocument($request->file('image'));

        if(!$documentData){
            return response()->json(['message' => 'Document invalide'], 400);
        }

        return response()->json([
            'success' => true,
            'document_data' => $documentData,
            'success_token' => $this->generateSessionToken()
        ]);
    }

    /**
     * Verifcation par reconnaissance faciale
     */
    public function verifyFace(Request $request){
        $validator = Validator::make($request->all(), [
            'face_image' => 'required|image|max:2048',
            'session_token' => 'required|string'
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $faceverification = $this->faceDataService->verifyFaceImage($request->file('face_image'));

        if(!$faceverification['success']){
            return response()->json(['message' => 'Verification faciale échouée'], 400);
        }

        // creation ou recuperation de l'user
        $user = $this->userService->createOrRetrieveUser($faceverification['user_data']);

        //generation de token d'authentification
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Deconnexion
     */

     public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deconnexion réussie']);
     }


     /**
      * Generation du token de session
      */
      private function generateSessionToken(){
        return bin2hex(random_bytes(32));
      }

}
