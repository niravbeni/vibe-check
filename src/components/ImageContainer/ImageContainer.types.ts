import { ImageData } from '../../types'

export interface ImageContainerProps {
  images: ImageData[]
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void
  onImageDelete: (index: number) => void
} 