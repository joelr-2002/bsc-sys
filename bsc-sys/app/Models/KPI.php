<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * KPI - Key Performance Indicator
 * 
 * Indicador clave de desempeño con meta, umbrales y semáforos.
 * 
 * @property int $id
 * @property int $strategic_objective_id
 * @property int $owner_id
 * @property string $name
 * @property string|null $formula
 * @property string $unit (%, $, #, días, etc.)
 * @property string $frequency (daily|monthly|quarterly|annual)
 * @property float $target
 * @property float $threshold_green
 * @property float $threshold_yellow
 * @property bool $active
 * @property bool $audit_trail
 * @property string|null $description
 */
class KPI extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'strategic_objective_id',
        'owner_id',
        'name',
        'formula',
        'unit',
        'frequency',
        'target',
        'threshold_green',
        'threshold_yellow',
        'active',
        'audit_trail',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'strategic_objective_id' => 'integer',
        'owner_id' => 'integer',
        'target' => 'decimal:2',
        'threshold_green' => 'decimal:2',
        'threshold_yellow' => 'decimal:2',
        'active' => 'boolean',
        'audit_trail' => 'boolean',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kpis';

    /**
     * Get the strategic objective that owns this KPI.
     */
    public function strategicObjective(): BelongsTo
    {
        return $this->belongsTo(StrategicObjective::class);
    }

    /**
     * Get the owner (user) of this KPI.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get all values for this KPI.
     */
    public function values(): HasMany
    {
        return $this->hasMany(KPIValue::class)->where('superseded', false);
    }

    /**
     * Get the latest value for this KPI.
     */
    public function latestValue()
    {
        return $this->hasOne(KPIValue::class)
            ->where('superseded', false)
            ->latest('created_at');
    }

    /**
     * Scope: Only active KPIs.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope: Filter by frequency.
     */
    public function scopeFrequency($query, string $frequency)
    {
        return $query->where('frequency', $frequency);
    }

    /**
     * Scope: Only financial KPIs (with audit trail).
     */
    public function scopeFinancial($query)
    {
        return $query->where('audit_trail', true);
    }

    /**
     * Calculate traffic light color based on value.
     */
    public function calculateTrafficLight(float $value): string
    {
        $percentage = $this->target > 0 ? ($value / $this->target) : 0;

        if ($percentage >= $this->threshold_green) {
            return 'green';
        }

        if ($percentage >= $this->threshold_yellow) {
            return 'yellow';
        }

        return 'red';
    }

    /**
     * Calculate compliance percentage.
     */
    public function calculateCompliance(float $value): float
    {
        return $this->target > 0 ? round(($value / $this->target) * 100, 2) : 0;
    }

    /**
     * Check if this is a financial KPI.
     */
    public function isFinancial(): bool
    {
        return $this->audit_trail === true;
    }
}
