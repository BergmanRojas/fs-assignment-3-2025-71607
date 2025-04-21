using Application;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using NArchitecture.Core.Security.JWT;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using NArchitecture.Core.CrossCuttingConcerns.Exception.WebApi.Extensions;
using NArchitecture.Core.CrossCuttingConcerns.Exception.WebApi.Middleware;
using NArchitecture.Core.CrossCuttingConcerns.Logging.Configurations;
using NArchitecture.Core.ElasticSearch.Models;
using NArchitecture.Core.Localization.WebApi;
using NArchitecture.Core.Mailing;
using NArchitecture.Core.Persistence.WebApi;
using NArchitecture.Core.Security.WebApi.Swagger.Extensions;
using Persistence;
using Swashbuckle.AspNetCore.SwaggerUI;
using WebAPI;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Basic services
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();

// Application layer services
builder.Services.AddApplicationServices(
    mailSettings: builder.Configuration.GetSection("MailSettings").Get<MailSettings>()
        ?? throw new InvalidOperationException("MailSettings section not found."),
    fileLogConfiguration: builder.Configuration.GetSection("SeriLogConfigurations:FileLogConfiguration")
        .Get<FileLogConfiguration>()
        ?? throw new InvalidOperationException("FileLogConfiguration section not found."),
    elasticSearchConfig: builder.Configuration.GetSection("ElasticSearchConfig").Get<ElasticSearchConfig>()
        ?? throw new InvalidOperationException("ElasticSearchConfig section not found."),
    tokenOptions: builder.Configuration.GetSection("TokenOptions").Get<TokenOptions>()
        ?? throw new InvalidOperationException("TokenOptions section not found.")
);

builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddInfrastructureServices();

// ✅ Microsoft Identity with Azure AD B2C
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAdB2C"));

builder.Services.AddAuthorization();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.AddSecurityDefinition(
        name: "Bearer",
        securityScheme: new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description =
                "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer YOUR_TOKEN\".\n\nEnter your token in the text input below."
        }
    );
    opt.OperationFilter<BearerSecurityRequirementOperationFilter>();
});

WebApplication app = builder.Build();

// Middleware configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(opt =>
    {
        opt.DocExpansion(DocExpansion.None);
    });
}
else
{
    app.ConfigureCustomExceptionMiddleware();
}

app.UseDbMigrationApplier();

// ✅ Auth middlewares
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

// Web API CORS
const string webApiSection = "WebAPIConfiguration";
WebApiConfiguration webApiConfig =
    app.Configuration.GetSection(webApiSection).Get<WebApiConfiguration>()
    ?? throw new InvalidOperationException($"\"{webApiSection}\" section not found.");

app.UseCors(opt =>
    opt.WithOrigins(webApiConfig.AllowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());

app.UseResponseLocalization();

app.Run();