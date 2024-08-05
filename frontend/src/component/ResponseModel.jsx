import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  Link,
} from "@mui/material";
const ResponseModal = ({
  open,
  handleClose,
  messages,
}) => {
 

  const handleCloseModal = () => {
    handleClose();
  };
 console.log("Search Results",messages)

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Search Results
        </Typography>
        {messages && messages.length > 0 ? (
          <Box>
            {messages.map((message, index) => (
                <Link href={message.link === 'false' ? `https://www.google.com/search?q=${message.source}+${message.title}` : message.link  
                || 
                message?.innercards[0].titlelink==='false' ? 
                `https://www.google.com/search?q=${message?.innercards[0].source}+${message?.innercards[0].title}` : message?.innercards[0].titlelink
              } target="_blank" sx={{textDecoration:'none'}}>
              <Paper
                key={index}
                elevation={3}
                sx={{
                  mb: 2,
                  p: 2,
                  transition: "background-color 0.3s",
                  ":hover": {
                    backgroundColor: "lightgrey",
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flexDirection:'column'
                  }}
                >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                     {message.title || message?.innercards[0].title}
                    </Typography>
                    <Typography>{message.source || message?.innercards[0].source}</Typography>
                </Box>
              </Paper>
              </Link>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" sx={{fontWeight: 'bold', fontSize: "1.5rem", marginY: "2rem",display: "flex", justifyContent: "center", alingSelf: "center"}}>No results found</Typography>
        )}
        <Button
          onClick={handleCloseModal}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ResponseModal;