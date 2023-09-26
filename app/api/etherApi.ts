export async function etherApiReq(method: string, params: string) {
    const url = `${process.env.ETHERPAD_URL}/api/1/${method}?apikey=${process.env.ETHERPAD_API_KEY}&${params}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch data, Response code: ${res.status}`)

    const json: {
        code: number,
        message: string,
        data: any
    } = await res.json()

    if (json.code != 0) throw new Error(`Failed to fetch data at URL ${url}, response: ${JSON.stringify(json)}`)

    return json.data
}