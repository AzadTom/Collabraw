

const UploadingImagesLoader = ({ isUploadingImage }: { isUploadingImage: boolean }) => {
  return (
    <>
      {isUploadingImage && (
        <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
          <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-lg animate-pulse">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-card-foreground">
              Uploading images to Cloudinary...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadingImagesLoader;
