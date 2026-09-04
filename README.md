# Neonallee

A publishing platform for writers, built around **real-time collaborative editing**. Authors draft texts together in a shared editor, organise them into series, and publish them to a public readership that can browse by genre, follow authors, and comment.

Built solo as an MVP between June 2023 and July 2025. Next.js App Router, Prisma/PostgreSQL, and a self-hosted Etherpad instance doing the collaborative editing. The UI is in German.

---

## What it does

- **Collaborative drafting.** Every document ("pad") is a live Etherpad session. Multiple authors write in the same document simultaneously, with per-document access control.
- **Sharing with three permission levels.** A pad owner invites other authors by username and grants `READ`, `WRITE`, or `OWNER`.
- **Series.** Pads can be grouped into ordered series — a serialised novel, a poetry cycle — and reordered by drag and drop. Readers get pagination between instalments.
- **Publishing.** An author flips a pad to published; it then renders as a public article at `/article/<id>`, with the text pulled from Etherpad as HTML.
- **Discovery.** A landing page with genre browsing and a rotating selection of authors, plus author profiles, a follow system, and an index of everyone who has published.
- **Comments** on published articles, deletable by their author or by an admin.
- **Admin view** listing every pad with its members and permissions.

## Architecture

The interesting part of this project is not the CRUD — it's the seam between Next.js and Etherpad, and the authorization model that spans both.

### Etherpad integration

Real-time collaborative editing is genuinely hard, so it's delegated to [Etherpad](https://etherpad.org/), which runs as a **separate service** alongside the Next.js app. This app owns identity, permissions, metadata, and presentation; Etherpad owns the document text and the CRDT-ish machinery that keeps concurrent editors in sync.

The two are joined in three places:

1. **Lifecycle, server-side.** `app/_actions/pad/utils.ts` wraps Etherpad's HTTP API (`etherApiReq`). Creating a pad creates the database row _and_ the Etherpad pad plus an Etherpad author mapped to the local user id; deleting one deletes both. The API key never reaches the browser.
2. **Editing, client-side.** `app/(routes)/user-pads/pad/[padId]/page.tsx` checks the user's permission on the pad, then embeds Etherpad in an `<iframe>`. Session cookies are scoped to `.<domain>` (`app/_utils/auth.ts`) so the Etherpad subdomain sits inside the same cookie scope — with a small `middleware.ts` shim that sets a cookie Etherpad requires before it will load in a frame.
3. **Reading.** Publishing an article calls Etherpad's `getHTML` and renders the result, so readers never touch the editor service.

### Server actions with a uniform authorization pattern

The app originally had a REST API; it was converted wholesale to Next.js server actions. Since a server action is a public endpoint, every one of them follows the same three-step shape, in this order:

```ts
export default async function changePadName(data: schemaType) {
    const { padId, padName } = changePadNameSchema.parse(data) // 1. validate input (zod)
    const session = await authOrRedirect() // 2. authenticate
    await checkIsPadOwner(padId, session.user.id) // 3. authorize
    // ...only now touch the database
}
```

`getPadPermission` / `checkIsPadOwner` in `app/_actions/pad/utils.ts` are the shared authorization primitives, resolving a user's permission on a pad (with admins short-circuiting to `OWNER`). Input schemas live in `app/_types/schemas.ts` and are shared between the server actions and the client-side forms.

### Data model

`prisma/schema.prisma`. The shape worth knowing:

- `User` is the account (NextAuth-owned). `Author` is an optional 1:1 extension — you sign in as a user, then separately register as an author before you can create or publish anything.
- `AuthorsOnPads` is the join table carrying the `Permission` enum; it's what every authorization check reads.
- `PadsOnSeries` keys on `(seriesId, indexInSeries)`, so ordering is enforced by the database rather than by application code. Reordering deletes and rewrites the series' rows (`app/(routes)/user-pads/_actions/update-series.ts`), after verifying that the caller owns the series and that every pad submitted is already in it.

## Tech stack

|             |                                                             |
| ----------- | ----------------------------------------------------------- |
| Framework   | Next.js 14 (App Router, Server Components, Server Actions)  |
| Language    | TypeScript, `strict`                                        |
| Database    | PostgreSQL via Prisma                                       |
| Auth        | NextAuth v4, Google provider, Prisma adapter                |
| Editing     | Etherpad (self-hosted, separate service)                    |
| UI          | Mantine + Tailwind CSS                                      |
| Forms       | React Hook Form + zod                                       |
| Drag & drop | react-dnd, react-movable                                    |
| Deployment  | Docker (Next.js standalone output), ran on Google Cloud Run |

## Running it locally

You need Node 18+, a PostgreSQL database, and an Etherpad instance on `:9001` with its API enabled.

```bash
npm install                 # runs `prisma generate` via postinstall
```

Create `.env.local` with the secrets (`.env.development` and `.env.production` are committed and hold only non-secret URLs):

```bash
POSTGRES_URL=postgresql://user:password@localhost:5432/neonallee
NEXTAUTH_SECRET=            # openssl rand -base64 32
GOOGLE_CLIENT_ID=           # Google Cloud console → OAuth 2.0 credentials
GOOGLE_CLIENT_SECRET=
ETHERPAD_API_KEY=           # Etherpad's APIKEY.txt
```

Then:

```bash
npx prisma migrate deploy   # see the note under Project status
npm run dev
```

Genres are not seeded — add rows to the `Genre` table to populate the landing page.

## Project status

An MVP, and finished as one. It was deployed to Google Cloud Run for a while but never opened to real users, and it is not actively maintained. Things a production version would need, and which this deliberately doesn't have:

- **No test suite** and no CI.
- **Article HTML is rendered unsanitised.** `getHTML` output from Etherpad goes into `dangerouslySetInnerHTML`; a hardened version would run it through an allow-list sanitiser.
