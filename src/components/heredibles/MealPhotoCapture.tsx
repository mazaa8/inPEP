import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  FlipCameraIos as FlipIcon,
  PhotoLibrary as GalleryIcon,
} from '@mui/icons-material';

interface MealPhotoCaptureProps {
  open: boolean;
  onClose: () => void;
  onPhotoCapture: (photoDataUrl: string) => void;
  mealName: string;
}

const MealPhotoCapture = ({ open, onClose, onPhotoCapture, mealName }: MealPhotoCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false,
      });
      setStream(mediaStream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoDataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedPhoto(null);
    setError(null);
    setCameraActive(false);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">📸 Document Meal</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {mealName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!cameraActive && !capturedPhoto && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Take a photo of the prepared meal
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<CameraIcon />}
                onClick={startCamera}
                size="large"
              >
                Open Camera
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<GalleryIcon />}
                size="large"
              >
                Choose Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>
        )}

        {cameraActive && !capturedPhoto && (
          <Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '75%', // 4:3 aspect ratio
                bgcolor: 'black',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton
                onClick={capturePhoto}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 64,
                  height: 64,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <CameraIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Box>
        )}

        {capturedPhoto && (
          <Box>
            <Box
              component="img"
              src={capturedPhoto}
              alt="Captured meal"
              sx={{
                width: '100%',
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'divider',
              }}
            />
            <Alert severity="success" sx={{ mt: 2 }}>
              Photo captured! Review and confirm or retake.
            </Alert>
          </Box>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>

      <DialogActions>
        {capturedPhoto ? (
          <>
            <Button onClick={handleRetake} startIcon={<FlipIcon />}>
              Retake
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="success">
              Confirm & Save
            </Button>
          </>
        ) : (
          <Button onClick={handleClose}>Cancel</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MealPhotoCapture;
