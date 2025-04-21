using Application.Services.ImageService;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Adapters.ImageService
{
    public class CloudinaryImageServiceAdapter : ImageServiceBase
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryImageServiceAdapter(IConfiguration configuration)
        {
            Account? account = configuration.GetSection("CloudinaryAccount").Get<Account>();
            _cloudinary = new Cloudinary(account);
        }

        public override async Task<string> UploadAsync(IFormFile formFile)
        {
            await FileMustBeInImageFormat(formFile);

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(formFile.FileName, formFile.OpenReadStream()),
                UseFilename = false,
                UniqueFilename = true,
                Overwrite = false
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.Url.ToString();
        }

        public override async Task DeleteAsync(string imageUrl)
        {
            var publicId = ExtractPublicId(imageUrl);
            var deletionParams = new DeletionParams(publicId);
            await _cloudinary.DestroyAsync(deletionParams);
        }

        private string ExtractPublicId(string imageUrl)
        {
            int startIndex = imageUrl.LastIndexOf('/') + 1;
            int endIndex = imageUrl.LastIndexOf('.');
            return imageUrl.Substring(startIndex, endIndex - startIndex);
        }
    }
}
