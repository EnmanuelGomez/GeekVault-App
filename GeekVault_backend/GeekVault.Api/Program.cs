using System.Reflection;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "GeekVault API",
        Version = "v1",
        Description = "API de GeekVault para personajes, categorías y auth."
    });

    // Incluir XML comments si está habilitado en el .csproj
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath);

    // Esquema de seguridad JWT (para cuando integres auth)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese el token JWT con el prefijo Bearer. Ej: Bearer {token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Swagger UI visible en Desarrollo (puedes habilitarlo en Prod si quieres)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        // /docs como ruta del UI (si prefieres /swagger, quita esta línea)
        c.RoutePrefix = "docs";
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GeekVault API v1");
    });
}

app.UseHttpsRedirection();

// Si usas JWT más adelante:
// app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
