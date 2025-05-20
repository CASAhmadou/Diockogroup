<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Transactions;
use App\Models\Users;
use App\Notifications\TransactionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Obtenir le solde de l'utilisateur
     */
    public function getBalance(Request $request)
    {
        return response()->json([
            'balance' => $request->user()->balance,
            'formatted_balance' => number_format($request->user()->balance, 2) . ' f CFA'
        ]);
    }

    /**
     * Recharger le compte
     */
    public function recharge(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1|max:5000',
            'method' => 'required|string|in:mobile_money,orange_money,wave,card'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $user = $request->user();

            // Simulation du traitement de paiement
            $paymentResult = $this->processPayment($request->amount, $request->method);

            if (!$paymentResult['success']) {
                return response()->json(['message' => 'Échec du paiement'], 400);
            }

            // Création de la transaction
            $transaction = Transactions::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'amount' => $request->amount,
                'method' => $request->method,
                'status' => 'completed',
                'reference_number' => $paymentResult['reference_number'],
                'description' => 'Recharge de compte'
            ]);

            // Mise à jour du solde
            $user->increment('balance', $request->amount);

            // Notification
            $user->notify(new TransactionNotification($transaction));

            DB::commit();

            return response()->json([
                'success' => true,
                'transaction' => $transaction,
                'new_balance' => $user->fresh()->balance
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Erreur lors de la recharge'], 500);
        }
    }

    /**
     * Transférer de l'argent
     */
    public function transfer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_phone' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $sender = $request->user();

        // Vérification du solde
        if ($sender->balance < $request->amount) {
            return response()->json(['message' => 'Solde insuffisant'], 400);
        }

        // Recherche du destinataire
        $recipient = Users::where('phone', $request->recipient_phone)->first();

        if (!$recipient) {
            return response()->json(['message' => 'Destinataire non trouvé'], 404);
        }

        DB::beginTransaction();

        try {
            // Débit du compte expéditeur
            $debitTransaction = Transactions::create([
                'user_id' => $sender->id,
                'type' => 'debit',
                'amount' => -$request->amount,
                'recipient_id' => $recipient->id,
                'status' => 'completed',
                'description' => $request->description ?? 'Transfert vers ' . $recipient->name
            ]);

            // Crédit du compte destinataire
            $creditTransaction = Transactions::create([
                'user_id' => $recipient->id,
                'type' => 'credit',
                'amount' => $request->amount,
                'sender_id' => $sender->id,
                'status' => 'completed',
                'description' => 'Transfert de ' . $sender->name
            ]);

            // Mise à jour des soldes
            $sender->decrement('balance', $request->amount);
            $recipient->increment('balance', $request->amount);

            // Notifications
            $sender->notify(new TransactionNotification($debitTransaction));
            $recipient->notify(new TransactionNotification($creditTransaction));

            DB::commit();

            return response()->json([
                'success' => true,
                'transaction' => $debitTransaction,
                'new_balance' => $sender->fresh()->balance
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Erreur lors du transfert'], 500);
        }
    }

    /**
     * Obtenir l'historique des transactions
     */
    public function getHistory(Request $request)
    {
        $transactions = $request->user()
            ->transactions()
            ->with(['recipient', 'sender'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($transactions);
    }

    /**
     * Traitement du paiement (simulation)
     */
    private function processPayment($amount, $method)
    {
        // Simulation - En production, intégrez les APIs des providers
        $providers = [
            'mobile_money' => 'Mobile Money Service',
            'orange_money' => 'Orange Money API',
            'wave' => 'Wave API',
            'card' => 'Stripe/PayPal'
        ];

        return [
            'success' => true,
            'reference' => 'TXN_' . uniqid(),
            'provider' => $providers[$method],
            'gateway_response' => 'SUCCESS'
        ];
    }
}
