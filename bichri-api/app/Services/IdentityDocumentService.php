<?php
namespace App\Services;

use Illuminate\Http\UploadedFile;

class IdentityDocumentService {
    /**
     * Traitement du document d'identité (simulation)
    */
    public function processDocument(UploadedFile $image){
        return [
            'full_name' => 'CAS',
            'dat_of_birth' => '1992-07-09',
            'id_number' => '123456789',
            'document_number' => 'AB123456',
            'expiry_date' => '2030-01-01'
        ];
    }
}
