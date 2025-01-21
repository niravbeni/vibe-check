import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  padding: 0.5rem;
  margin-top: 1.5rem;
`

export const UploadBox = styled.div<{ 
  $hasImage: boolean; 
  $index: number;
  $isDragActive?: boolean;
}>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  transform: rotate(${props => {
    // Subtle random rotation for each image
    const rotations = [-3, 2, -2];
    return `${rotations[props.$index]}deg`;
  }});
  transition: all 0.3s ease;
  cursor: ${props => props.$hasImage ? 'default' : 'pointer'};
  border: ${props => props.$isDragActive ? '2px dashed #4f46e5' : 'none'};

  &:hover {
    transform: rotate(0deg) translateY(-5px);
    z-index: 2;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: ${props => props.$hasImage ? 'none' : '2px dashed #cbd5e1'};
    border-radius: 4px;
    margin: 12px;
    z-index: 1;
    background: ${props => props.$hasImage ? 'none' : '#f8fafc'};
    transition: all 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    pointer-events: none;
  }

  &:hover::before {
    border-color: #4f46e5;
    background-color: ${props => props.$hasImage ? 'none' : '#f1f5f9'};
  }
`

export const ImageFrame = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 2px;
  z-index: 1;
`

export const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

export const DeleteButton = styled.button`
  position: absolute;
  top: -10px;
  left: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #000000;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  padding: 0 0 4px 0;
  z-index: 3;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #333333;
    transform: scale(1.1);
  }

  &::after {
    content: '×';
    display: block;
    color: white;
    font-weight: bold;
  }
`

export const UploadInput = styled.input`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
`

export const UploadPlaceholder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #64748b;
  text-align: center;
  pointer-events: none;
  width: 100%;
  padding: 1rem;
  z-index: 1;
`

export const DragText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
` 