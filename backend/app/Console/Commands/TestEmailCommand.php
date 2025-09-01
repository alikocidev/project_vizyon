<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email sending functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info('Attempting to send test email to: ' . $email);
        
        try {
            Mail::raw('Bu bir test emailidir.', function ($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email - Project Vizyon');
            });
            
            $this->info('Email sent successfully!');
        } catch (\Exception $e) {
            $this->error('Failed to send email: ' . $e->getMessage());
            $this->error('Full error: ' . $e->getTraceAsString());
        }
    }
}
