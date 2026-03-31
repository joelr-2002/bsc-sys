<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Fuente de Datos
 *
 * Define fuentes de datos externas para alimentar KPIs (bases de datos, APIs, archivos).
 *
 * @property int $id
 * @property string $name
 * @property string $type (sql_server|mysql|postgresql|oracle|rest_api|file)
 * @property array $config
 * @property bool $active
 * @property string|null $cron_expression
 * @property \Carbon\Carbon|null $last_run_at
 * @property string|null $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 */
class DataSource extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'type',
        'config',
        'active',
        'cron_expression',
        'last_run_at',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'config' => 'array',
        'active' => 'boolean',
        'last_run_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'data_sources';

    /**
     * Get all ETL logs for this data source.
     */
    public function etlLogs(): HasMany
    {
        return $this->hasMany(ETLLog::class);
    }
}
