<?php
namespace App\Services;


class FaceDataService{
    /**
     * Verification faciale(simulation)
    */
    public function verifyFaceImage($image){
        // simulation - en production, utilise AWS Rekognition, Azure Face API
        return [
            'success' => true,
            'confidence_score' => 95.5,
            'user_data' => [
                'verified' => true,
                'match_score' => 95.5
            ]
        ];
    }
}
