import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Send } from '@mui/icons-material';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [maxTokens, setMaxTokens] = useState(150);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Por favor, digite uma pergunta');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/ask', {
        prompt,
        model,
        max_tokens: maxTokens
      });
      
      setResponse(res.data.response);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Integração com OpenAI
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Digite sua pergunta"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Modelo</InputLabel>
              <Select
                value={model}
                label="Modelo"
                onChange={(e) => setModel(e.target.value)}
              >
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                <MenuItem value="gpt-4">GPT-4</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              type="number"
              label="Máx. tokens"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              sx={{ width: 150 }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            fullWidth
          >
            {loading ? 'Processando...' : 'Enviar'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {response && (
          <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Resposta:
            </Typography>
            <Typography whiteSpace="pre-wrap">
              {response}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default App;
