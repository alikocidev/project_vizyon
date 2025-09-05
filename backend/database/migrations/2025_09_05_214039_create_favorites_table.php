<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('media_type'); // 'movie', 'tv', etc.
            $table->integer('media_id'); // TMDB ID
            $table->string('title');
            $table->string('poster_path')->nullable();
            $table->string('release_date')->nullable();
            $table->decimal('vote_average', 3, 1)->nullable();
            $table->json('genre_ids')->nullable();
            $table->text('overview')->nullable();
            $table->timestamps();
            
            // Prevent duplicate favorites
            $table->unique(['user_id', 'media_type', 'media_id']);
            
            // Index for faster queries
            $table->index(['user_id', 'media_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
