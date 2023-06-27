
import "server-only"
import PadAppBar from "./app-bar"

export default async function Page({ params }: { params: { groupID: string, padID: string } }) {

    return <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PadAppBar />
        <div style={{ flex: 1, display: 'flex' }}>
            <iframe
                name="embed_readwrite"
                src={`http://localhost:9001/p/${params.padID}?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false`}
                style={{ width: '100%', border: 0 }}
            />
        </div>
    </div>
}