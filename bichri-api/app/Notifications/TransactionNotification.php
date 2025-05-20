<?php

namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class TransactionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $transaction;

    public function __construct($transaction)
    {
        $this->transaction = $transaction;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'transaction_type' => 'transaction',
            'transaction_id' => $this->transaction->id,
            'message' => $this->getTransactionMessage(),
            'amount' => $this->transaction->amount
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->getTransactionMessage(),
            'amount' => $this->transaction->amount
        ]);
    }

    private function getTransactionMessage()
    {
        if ($this->transaction->type === 'credit') {
            return "Vous avez reçu " . abs($this->transaction->amount) . "f CFA";
        } else {
            return "Transfert de " . abs($this->transaction->amount) . "f CFA effectué";
        }
    }
}
