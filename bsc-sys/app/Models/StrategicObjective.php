<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Objetivo Estratégico
 * 
 * Objetivo vinculado a una perspectiva BSC con un responsable y fechas.
 * 
 * @property int $id
 * @property int $perspective_id
 * @property int $owner_id
 * @property string $name
 * @property string|null $description
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property bool $active
 */
class StrategicObjective extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'perspective_id',
        'owner_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'perspective_id' => 'integer',
        'owner_id' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
    ];

    /**
     * Get the perspective that owns this objective.
     */
    public function perspective(): BelongsTo
    {
        return $this->belongsTo(Perspective::class);
    }

    /**
     * Get the owner (user) of this objective.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get all KPIs for this objective.
     */
    public function kpis(): HasMany
    {
        return $this->hasMany(KPI::class);
    }

    /**
     * Get all initiatives for this objective.
     */
    public function initiatives(): HasMany
    {
        return $this->hasMany(Initiative::class);
    }

    /**
     * Get objectives that are caused by this one (this is the cause).
     */
    public function causedObjectives(): HasMany
    {
        return $this->hasMany(CausalRelation::class, 'cause_objective_id');
    }

    /**
     * Get objectives that cause this one (this is the effect).
     */
    public function causingObjectives(): HasMany
    {
        return $this->hasMany(CausalRelation::class, 'effect_objective_id');
    }

    /**
     * Scope: Only active objectives.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Check if the objective is currently in its active period.
     */
    public function isInActivePeriod(): bool
    {
        $now = now();
        return $now->between($this->start_date, $this->end_date);
    }
}
