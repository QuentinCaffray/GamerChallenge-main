export default function privacyPolicy() {
  return (
    <main className="m-5 mt-10 min-h-screen">
      <h2 className="text-center font-extrabold text-3xl">Privacy Policy</h2>
      <ol className="m-8">
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">1. Data Collection </h3>
          <p>We collect the following personal data:</p>
          <ul className="pl-6">
            <li>- Email address</li>
            <li>- Username</li>
            <li>- User-generated content (challenges, comments, scores)</li>
          </ul>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">2. Purpose of Data Processing </h3>
          <p>The collected data is used to:</p>
          <ul className="pl-6">
            <li>- Create and manage user accounts</li>
            <li>- Allow users to create and participate in challenges</li>
            <li>- Improve the user experience</li>
          </ul>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">3. Legal Basis</h3>
          <p>
            Data processing is based on user consent and the legitimate interest of providing the
            service, <br /> in accordance with the General Data Protection Regulation (GDPR).
          </p>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">4. Data Retention</h3>
          <p>
            Personal data is stored only for the duration necessary to provide the service. <br />
            Users may request deletion of their data at any time.
          </p>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">5. User Rights</h3>
          <p>In accordance with GDPR, users have the right to:</p>
          <ul className="pl-6">
            <li>- Access their data</li>
            <li>- Modify their data</li>
            <li>- Request deletion of their data</li>
            <li>- Withdraw consent</li>
          </ul>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">6. Cookies</h3>
          <p>
            This website uses cookies for authentication and session management. <br />
            No tracking or advertising cookies are used.
          </p>
        </li>
        <li className="p-3 pb-8">
          <h3 className="pb-2 pl-10 text-xl">7. Contact</h3>
          <p>
            For any privacy-related request, please contact: <br />
            support@challengearena.com
          </p>
        </li>
      </ol>
    </main>
  );
}
