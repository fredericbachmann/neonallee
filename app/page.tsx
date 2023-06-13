'use client'
import ActionBar from "./components/app-bar"
import { Box, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material"



export default async function Page() {
  return (
    <center>
      <ActionBar />
      <Stack sx={{ width: 1 / 2 }} spacing={3} padding={5}>
        {
          [...new Array(10)].map((_, index) =>
            <Card sx={{ display: 'flex'}} key={index}>
              <CardContent>
                <Typography variant="h5">Titel</Typography>
                <Typography>Text, Einleitung, beziehungsweise kurzer Teaser für den Text...</Typography>
              </CardContent>
              <Box sx={{ flexGrow: 1 }} />
              <CardMedia component='img' sx={{ width: 100 }} image='https://picsum.photos/300' />
            </Card>
          )}
      </Stack>
    </center>
  )
}