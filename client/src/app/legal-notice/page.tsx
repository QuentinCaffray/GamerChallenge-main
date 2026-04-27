export default function legalNotice() {
  return (
    <main className="m-5 mt-10 min-h-screen">
      <h2 className="text-center font-extrabold text-3xl">Legal Notice</h2>
      <ol className="m-8">
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">Website Editor</h3>
          <p>This website is published as part of an academic project.</p>
          <ul className="pl-6">
            <li>
              Project name: <strong>ChallengeArena</strong>
            </li>
            <li>
              Editor: Stwompy, Medou, Shinro, Keerodan{' '}
              <span className="opacity-0 hover:opacity-100 hover:text-(--button-delete)">
                and the Discord&apos;s fart sound
              </span>
            </li>
            <li>Contact: support@challengearena.com</li>
          </ul>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">Hosting</h3>
          <p>This website is hosted by:</p>
          <ul className="pl-6">
            <li>Railway</li>
            <li>[Hosting Provider Address]</li>
          </ul>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">Disclaimer</h3>
          <p>
            This website is a student project created for educational purposes only. <br />
            The services and features presented are not intended for commercial use.
          </p>
        </li>
        <li className="p-3 pb-8">
          <p>
            The editor cannot be held responsible for any misuse of the platform or for
            user-generated content.
          </p>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">Intellectual Property</h3>
          <p>
            All content on this website (texts, logos, UI elements) is the property of the project
            team unless otherwise stated.
          </p>
        </li>
        <li className="p-3 pb-8">
          <p>
            <strong>
              All video game names, logos, and trademarks belong to their respective owners.
              <br />
              This project is not affiliated with or endorsed by any game publisher.
            </strong>
          </p>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">Governing Law</h3>
          <p>This website is governed by the laws of France.</p>
        </li>
      </ol>
    </main>
  );
}
