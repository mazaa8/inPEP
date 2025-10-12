import { useState } from 'react';
import { Box, Typography, Dialog, IconButton, Grid } from '@mui/material';
import { Close, PhotoCamera, Videocam } from '@mui/icons-material';
import type { MediaAttachment } from '../../services/journalService';

interface MediaGalleryProps {
  attachments: MediaAttachment[];
}

const MediaGallery = ({ attachments }: MediaGalleryProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);

  if (!attachments || attachments.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1b5e20' }}>
        Attachments ({attachments.length})
      </Typography>
      
      <Grid container spacing={2}>
        {attachments.map((attachment, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box
              onClick={() => setSelectedMedia(attachment)}
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // 1:1 aspect ratio
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid rgba(76, 175, 80, 0.2)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
                  border: '2px solid rgba(76, 175, 80, 0.5)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.data}
                    alt={attachment.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                    }}
                  >
                    <Videocam sx={{ fontSize: 48, color: '#4caf50' }} />
                  </Box>
                )}
                
                {/* Type indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    p: 0.5,
                  }}
                >
                  {attachment.type.startsWith('image/') ? (
                    <PhotoCamera sx={{ fontSize: 16, color: 'white' }} />
                  ) : (
                    <Videocam sx={{ fontSize: 16, color: 'white' }} />
                  )}
                </Box>

                {/* Filename */}
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    p: 0.5,
                    fontSize: '0.65rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {attachment.name}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Full-screen viewer */}
      <Dialog
        open={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: 'none',
          },
        }}
      >
        {selectedMedia && (
          <Box sx={{ position: 'relative', p: 2 }}>
            <IconButton
              onClick={() => setSelectedMedia(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                zIndex: 1,
              }}
            >
              <Close />
            </IconButton>
            
            {selectedMedia.type.startsWith('image/') ? (
              <img
                src={selectedMedia.data}
                alt={selectedMedia.name}
                style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
              />
            ) : (
              <video
                src={selectedMedia.data}
                controls
                style={{ width: '100%', height: 'auto', maxHeight: '80vh' }}
              />
            )}
            
            <Typography
              variant="body2"
              sx={{ color: 'white', mt: 2, textAlign: 'center' }}
            >
              {selectedMedia.name}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default MediaGallery;
