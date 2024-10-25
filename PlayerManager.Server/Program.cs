using PlayerManager.Server.Enums;
using PlayerManager.Server.Models;
using PlayerManager.Server.Repositories;
using PlayerManager.Server.Services;
using PlayerManager.Server.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Configure global JSON serialization options
builder.Services.ConfigureHttpJsonOptions(options =>
{
    // Add a converter to serialize enums as strings
    options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IPlayerRepository, InMemoryPlayerRepository>();
builder.Services.AddScoped<IPlayerSelectionService, PlayerSelectionService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("https://localhost:5173") // React app origin
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(); // Enable CORS

// Enable Swagger middleware in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Player Management API V1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapGet("/api/", () => "Player Management API");

app.MapGet("/api/players", (IPlayerRepository repo) => repo.GetAllPlayers());

app.MapGet("/api/skills", () =>
{
    List<string> skills = new List<string>();
    foreach (var skill in Enum.GetValues<SkillName>())
    {
        skills.Add(skill.ToString());
    }
    return Results.Ok(skills);
});

app.MapPost("/api/players", (Player player, IPlayerRepository repo) => {
    // Validate player name
    if (!PlayerNameValidator.IsValidPlayerName(player.Name, out string? errorMessage))
    {
        return Results.BadRequest(errorMessage);
    }

    // Check if all skill names are valid enums
    foreach (var skill in player.Skills)
    {
        if (!Enum.IsDefined(typeof(SkillName), skill.Name))
            return Results.BadRequest($"Invalid skill name: {skill.Name}");
    }

    // Check if the position is valid
    if (!Enum.IsDefined(typeof(Position), player.Position))
        return Results.BadRequest($"Invalid position: {player.Position}");

    repo.AddPlayer(player);
    return Results.Created($"/players/{player.Id}", player);
});

app.MapPost("/api/select", (string positionStr, string skillStr, string? existingPlayers, IPlayerSelectionService selectionService) => {
    // Parse the position enum from string
    if (!Enum.TryParse<Position>(positionStr, true, out var position))
        return Results.BadRequest($"Invalid position: {positionStr}");

    // Parse the skill name enum from string
    if (!Enum.TryParse<SkillName>(skillStr, true, out var skillName))
        return Results.BadRequest($"Invalid skill name: {skillStr}");

    // Parse the existing player names, if any
    var existingPlayerNames = existingPlayers?.Split(',').ToList() ?? new List<string>();

    // Call the selection service to get the best player
    var bestPlayer = selectionService.SelectBestPlayer(position, skillName, existingPlayerNames);
    if (bestPlayer is null)
        return Results.NotFound("No suitable player found.");

    return Results.Ok(bestPlayer);
});

app.MapPost("/api/getrandomplayerlist", (IPlayerRepository repository) => {
    GenerateRandomPlayers.GeneratePlayers(100, repository); // Generate and store players in the repository
    return Results.NoContent(); // Return 204 No Content
});

app.MapPut("/api/players/{identifier}", (string identifier, Player updatedPlayer, IPlayerRepository repo) => {
    // Determine if identifier is a Guid or name
    Player? existingPlayer;
    if (GuidHelper.IsValidGuid(identifier))
    {
        existingPlayer = repo.GetPlayerById(Guid.Parse(identifier));
    }
    else
    {
        existingPlayer = repo.GetPlayerByName(identifier);
    }

    if (existingPlayer is null)
    {
        return Results.NotFound($"Player '{identifier}' not found.");
    }

    // Update the player
    updatedPlayer.Id = existingPlayer.Id; // Keep the original Guid
    repo.UpdatePlayer(updatedPlayer);
    return Results.Ok(updatedPlayer);
});


app.MapDelete("/api/players/{identifier}", (string identifier, IPlayerRepository repo) => {
    Player? playerToDelete;
    if (GuidHelper.IsValidGuid(identifier))
    {
        playerToDelete = repo.GetPlayerById(Guid.Parse(identifier));
    }
    else
    {
        playerToDelete = repo.GetPlayerByName(identifier);
    }

    if (playerToDelete is null)
    {
        return Results.NotFound($"Player '{identifier}' not found.");
    }

    repo.DeletePlayer(playerToDelete.Id);
    return Results.NoContent();
});


app.MapGet("/api/players/{identifier}", (string identifier, IPlayerRepository repo) => {
    // Check if the identifier is a valid Guid
    Player? player;
    if (GuidHelper.IsValidGuid(identifier))
    {
        player = repo.GetPlayerById(Guid.Parse(identifier));
    }
    else
    {
        player = repo.GetPlayerByName(identifier);
    }

    return player is not null ? Results.Ok(player) : Results.NotFound($"Player '{identifier}' not found.");
});

app.Run();