<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Perspectiva BSC
 * 
 * Una de las 4 perspectivas estándar (Financiera, Cliente, Procesos, Aprendizaje)
 * o una perspectiva personalizada.
 * 
 * @property int $id
 * @property int $strategic_plan_id
 * @property string $name
 * @property string $type (financial|customer|process|learning|custom)
 * @property int $order
 * @property bool $active
 * @property string|null $description
 * @property string|null $color
 */
class Perspective extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'strategic_plan_id',
        'name',
        'type',
        'order',
        'active',
        'description',
        'color',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'strategic_plan_id' => 'integer',
        'order' => 'integer',
        'active' => 'boolean',
    ];

    /**
     * Get the strategic plan that owns this perspective.
     */
    public function strategicPlan(): BelongsTo
    {
        return $this->belongsTo(StrategicPlan::class);
    }

    /**
     * Get all strategic objectives for this perspective.
     */
    public function objectives(): HasMany
    {
        return $this->hasMany(StrategicObjective::class);
    }

    /**
     * Scope: Only active perspectives.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope: Order by the 'order' field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Scope: Filter by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Check if this is a standard BSC perspective.
     */
    public function isStandard(): bool
    {
        return in_array($this->type, ['financial', 'customer', 'process', 'learning']);
    }

    /**
     * Get the default color for this perspective type.
     */
    public function getDefaultColor(): string
    {
        return match($this->type) {
            'financial' => '#1677ff',
            'customer' => '#52c41a',
            'process' => '#faad14',
            'learning' => '#722ed1',
            default => '#8c8c8c',
        };
    }
}
