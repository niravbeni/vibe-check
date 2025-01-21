import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Container, 
  UploadBox, 
  ImageFrame,
  Image, 
  DeleteButton, 
  UploadPlaceholder,
  DragText
} from './ImageContainer.styles'

// Define custom ImageData interface
interface CustomImageData {
  url: string;
  base64: string;
}

interface ImageContainerProps {
  images: CustomImageData[];
  onImageUpload?: (files: File[], index: number) => void;
  onImageDelete?: (index: number) => void;
}

export const ImageContainer = ({ images, onImageUpload, onImageDelete }: ImageContainerProps) => {
  const onDrop = useCallback((acceptedFiles: File[], index: number) => {
    if (onImageUpload) {
      onImageUpload(acceptedFiles, index)
    }
  }, [onImageUpload])

  // Create individual dropzones at the top level
  const dropzone0 = useDropzone({
    onDrop: (files) => onDrop(files, 0),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false
  })

  const dropzone1 = useDropzone({
    onDrop: (files) => onDrop(files, 1),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false
  })

  const dropzone2 = useDropzone({
    onDrop: (files) => onDrop(files, 2),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false
  })

  const dropzones = [dropzone0, dropzone1, dropzone2]

  return (
    <Container>
      {dropzones.map(({ getRootProps, getInputProps, isDragActive }, index) => (
        <UploadBox 
          key={index} 
          $hasImage={!!images[index]?.url} 
          $index={index}
          $isDragActive={isDragActive}
          {...(onImageUpload ? getRootProps() : {})}
        >
          {images[index]?.url ? (
            <>
              {onImageDelete && <DeleteButton onClick={(e) => {
                e.stopPropagation()
                onImageDelete(index)
              }} />}
              <ImageFrame>
                <Image src={images[index].url} alt={`Upload ${index + 1}`} />
              </ImageFrame>
            </>
          ) : (
            <>
              {onImageUpload && (
                <>
                  <input {...getInputProps()} />
                  <UploadPlaceholder>
                    {isDragActive ? (
                      <DragText>Drop image here</DragText>
                    ) : (
                      <DragText>
                        📸 Click to upload
                      </DragText>
                    )}
                  </UploadPlaceholder>
                </>
              )}
            </>
          )}
        </UploadBox>
      ))}
    </Container>
  )
} 