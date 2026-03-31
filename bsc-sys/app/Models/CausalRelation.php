<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Relación Causal entre Objetivos
 *
 * Define relaciones de causa-efecto entre objetivos estratégicos.
 *
 * @property int $id
 * @property int $cause_objective_id
 * @property int $effect_objective_id
 * @property string|null $description
 * @property int $strength (1-10)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class CausalRelation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'cause_objective_id',
        'effect_objective_id',
        'description',
        'strength',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'cause_objective_id' => 'integer',
        'effect_objective_id' => 'integer',
        'strength' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'causal_relations';

    /**
     * Get the cause objective.
     */
    public function causeObjective(): BelongsTo
    {
        return $this->belongsTo(StrategicObjective::class, 'cause_objective_id');
    }

    /**
     * Get the effect objective.
     */
    public function effectObjective(): BelongsTo
    {
        return $this->belongsTo(StrategicObjective::class, 'effect_objective_id');
    }
}
