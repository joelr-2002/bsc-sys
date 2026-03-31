<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Valor de KPI
 *
 * Registro inmutable de valores capturados para un KPI en un período de medición.
 * Los registros no se eliminan sino que se marcan como superseded.
 *
 * @property int $id
 * @property int $kpi_id
 * @property int $measurement_period_id
 * @property int $loaded_by_user_id
 * @property float $value
 * @property string $traffic_light (red|yellow|green)
 * @property string|null $source_type (manual|api|file|sql_query)
 * @property int|null $source_id
 * @property bool $superseded
 * @property string|null $notes
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class KPIValue extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'kpi_id',
        'measurement_period_id',
        'loaded_by_user_id',
        'value',
        'traffic_light',
        'source_type',
        'source_id',
        'superseded',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'kpi_id' => 'integer',
        'measurement_period_id' => 'integer',
        'loaded_by_user_id' => 'integer',
        'value' => 'decimal:2',
        'source_id' => 'integer',
        'superseded' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kpi_values';

    /**
     * Get the KPI that owns this value.
     */
    public function kpi(): BelongsTo
    {
        return $this->belongsTo(KPI::class);
    }

    /**
     * Get the measurement period that owns this value.
     */
    public function measurementPeriod(): BelongsTo
    {
        return $this->belongsTo(MeasurementPeriod::class);
    }

    /**
     * Get the user who loaded this value.
     */
    public function loadedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'loaded_by_user_id');
    }

    /**
     * Scope: Only non-superseded values.
     */
    public function scopeNotSuperseded($query)
    {
        return $query->where('superseded', false);
    }

    /**
     * Scope: Filter by traffic light color.
     */
    public function scopeByTrafficLight($query, string $color)
    {
        return $query->where('traffic_light', $color);
    }
}
