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
        Schema::create('data_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['sql_server', 'mysql', 'postgresql', 'oracle', 'rest_api', 'file'])->default('file');
            $table->json('config'); // Configuración cifrada con AES-256
            $table->boolean('active')->default(true);
            $table->string('cron_expression')->nullable(); // Para scheduled loads
            $table->timestamp('last_run_at')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_sources');
    }
};
