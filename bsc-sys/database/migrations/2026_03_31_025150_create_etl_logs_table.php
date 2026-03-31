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
        Schema::create('etl_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_source_id')->nullable()->constrained('data_sources');
            $table->string('triggered_by'); // userId o "SCHEDULER"
            $table->enum('status', ['running', 'success', 'partial', 'failed'])->default('running');
            $table->integer('total_records')->nullable();
            $table->integer('success_count')->nullable();
            $table->integer('failed_count')->nullable();
            $table->json('error_details')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['data_source_id', 'status']);
            $table->index('started_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etl_logs');
    }
};
