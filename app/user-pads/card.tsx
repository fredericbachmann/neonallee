'use client'
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material'

export default function ArticleCard({ padIDs }: { padIDs: string[] }) {
    const router = useRouter()

    function getCard(padID: string) {
        return (
            <Card id={padID[0]} onClick={() => router.push(`/pad/${padID[0].replace('$', '/')}`)} style={{ width: '18rem', cursor: "pointer" }}>
                <CardActionArea>
                    <CardMedia component="img" src="https://picsum.photos/400/200" />
                    <CardContent>
                        <Typography gutterBottom variant="h5">Titel</Typography>
                        <Typography variant="body2" color="text.secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum venenatis tincidunt..</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }

    return (
        <Grid2 container spacing={5} xs justifyContent="center">
            {
                padIDs.map((padID) => {
                    if (padID[0]) {
                        return <Grid2>
                            {getCard(padID)}
                        </Grid2>
                    }
                })}
        </Grid2>
    )
}
