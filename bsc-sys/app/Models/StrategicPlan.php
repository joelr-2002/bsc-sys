<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Plan Estratégico BSC
 * 
 * Representa un plan estratégico completo (ej: Plan 2026)
 * con sus perspectivas, objetivos y KPIs asociados.
 * 
 * @property int $id
 * @property string $name
 * @property int $year
 * @property string $status (active|archived)
 * @property string|null $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class StrategicPlan extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'year',
        'status',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get all perspectives for this strategic plan.
     */
    public function perspectives(): HasMany
    {
        return $this->hasMany(Perspective::class)->orderBy('order');
    }

    /**
     * Scope: Only active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: Only archived plans.
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    /**
     * Check if the plan is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Archive this plan.
     */
    public function archive(): bool
    {
        return $this->update(['status' => 'archived']);
    }
}
