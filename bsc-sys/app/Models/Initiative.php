<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Iniciativa Estratégica
 *
 * Proyectos e iniciativas que contribuyen a cumplir objetivos estratégicos.
 *
 * @property int $id
 * @property int $strategic_objective_id
 * @property int $owner_id
 * @property string $name
 * @property string|null $description
 * @property string $status (planned|in_progress|completed|cancelled)
 * @property float|null $progress_percentage
 * @property float|null $budget
 * @property float|null $spent
 * @property \Carbon\Carbon|null $start_date
 * @property \Carbon\Carbon|null $end_date
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class Initiative extends Model
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
        'description',
        'status',
        'progress_percentage',
        'budget',
        'spent',
        'start_date',
        'end_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'strategic_objective_id' => 'integer',
        'owner_id' => 'integer',
        'progress_percentage' => 'decimal:2',
        'budget' => 'decimal:2',
        'spent' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'initiatives';

    /**
     * Get the strategic objective that owns this initiative.
     */
    public function strategicObjective(): BelongsTo
    {
        return $this->belongsTo(StrategicObjective::class);
    }

    /**
     * Get the owner (user) of this initiative.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Scope: Only in progress initiatives.
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    /**
     * Scope: Only completed initiatives.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
