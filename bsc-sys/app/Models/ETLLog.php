<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Log de ETL
 *
 * Registro inmutable de ejecuciones de procesos ETL desde fuentes de datos.
 *
 * @property int $id
 * @property int $data_source_id
 * @property string|null $triggered_by (manual|cron|api)
 * @property string $status (running|success|partial|failed)
 * @property int|null $total_records
 * @property int|null $success_count
 * @property int|null $failed_count
 * @property array|null $error_details
 * @property \Carbon\Carbon|null $started_at
 * @property \Carbon\Carbon|null $completed_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ETLLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'data_source_id',
        'triggered_by',
        'status',
        'total_records',
        'success_count',
        'failed_count',
        'error_details',
        'started_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_source_id' => 'integer',
        'total_records' => 'integer',
        'success_count' => 'integer',
        'failed_count' => 'integer',
        'error_details' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'etl_logs';

    /**
     * Get the data source that owns this ETL log.
     */
    public function dataSource(): BelongsTo
    {
        return $this->belongsTo(DataSource::class);
    }

    /**
     * Scope: Only successful executions.
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    /**
     * Scope: Only failed executions.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}
