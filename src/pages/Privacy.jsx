import { Link } from 'react-router-dom';
import Header from '../components/Header';

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'We may collect information you provide directly, including your name, username, email address, password, profile details, support requests, campaign submissions, comments, and other content you choose to upload or share.',
      'We may collect information about your use of Hurammy, including videos viewed, uploads, likes, follows, comments, votes, rankings, flower or coin activity, campaign participation, device information, browser type, IP address, log data, and approximate location derived from technical information.',
      'If you use third-party sign-in or payment services, we may receive information from those providers as permitted by your settings and their policies.'
    ]
  },
  {
    title: '2. How We Use Information',
    body: [
      'We use information to operate, maintain, personalize, and improve Hurammy, including account creation, authentication, video hosting, recommendations, search, campaign administration, contest operations, voting, rewards, and customer support.',
      'We may use information to communicate with you about your account, platform updates, security notices, support messages, campaigns, promotions, and policy changes.',
      'We may use information to detect, prevent, and respond to fraud, spam, abuse, vote manipulation, security incidents, illegal activity, and violations of our terms or policies.'
    ]
  },
  {
    title: '3. User Content and Public Information',
    body: [
      'Content you submit to public areas of Hurammy may be visible to other users and visitors. This may include videos, thumbnails, usernames, profile details, comments, votes, likes, rankings, campaign entries, and other public activity.',
      'Please avoid posting sensitive personal information or information about others unless you have permission and understand that public content may be viewed, shared, indexed, or copied by others.'
    ]
  },
  {
    title: '4. Cookies and Similar Technologies',
    body: [
      'Hurammy may use cookies, local storage, pixels, analytics tools, and similar technologies to keep you signed in, remember preferences such as language selection, measure performance, improve features, and understand platform usage.',
      'You can control cookies through your browser settings, but disabling certain technologies may affect how the website works.'
    ]
  },
  {
    title: '5. How We Share Information',
    body: [
      'We may share information with service providers who help us operate Hurammy, such as hosting providers, analytics providers, email providers, payment processors, security tools, content delivery networks, and customer support tools.',
      'We may share information when required by law, legal process, government request, or to protect the rights, safety, and security of Hurammy, our users, or others.',
      'If Hurammy is involved in a merger, acquisition, financing, reorganization, sale of assets, or similar transaction, information may be transferred as part of that transaction.',
      'We do not sell your personal information in the traditional sense. If applicable privacy laws define certain advertising or analytics activities as a sale or sharing, you may have rights to opt out.'
    ]
  },
  {
    title: '6. Payments and Transactions',
    body: [
      'If Hurammy offers purchases, paid features, coins, flowers, donations, or other transactions, payment details may be collected and processed by third-party payment providers.',
      'Hurammy may receive transaction confirmations, payment status, purchase history, and related information needed to provide paid features, prevent fraud, and maintain records.'
    ]
  },
  {
    title: '7. Data Retention',
    body: [
      'We keep information for as long as needed to provide Hurammy, maintain accounts, comply with legal obligations, resolve disputes, enforce agreements, prevent abuse, and support legitimate business needs.',
      'Public content or cached copies may remain visible for a period of time after deletion, and backups may retain information until they are overwritten or deleted in the ordinary course of business.'
    ]
  },
  {
    title: '8. Your Choices and Rights',
    body: [
      'You may be able to access, update, or delete certain account information through your account settings. You may also contact us to request access, correction, deletion, portability, restriction, or objection where applicable law provides those rights.',
      'You can opt out of some communications by using unsubscribe instructions or contacting us. We may still send important transactional, account, security, or legal notices.',
      'Depending on where you live, you may have additional privacy rights under laws such as state, national, or regional privacy regulations.'
    ]
  },
  {
    title: '9. Children and Minors',
    body: [
      'Hurammy is not intended for children under the age required by applicable law to use online services without parental consent.',
      'If we learn that we collected personal information from a child without required consent, we will take reasonable steps to delete it. Parents or guardians may contact us with concerns.'
    ]
  },
  {
    title: '10. Security',
    body: [
      'We use reasonable administrative, technical, and organizational measures designed to protect information. However, no website, app, transmission, or storage system can be guaranteed to be completely secure.',
      'You are responsible for keeping your account credentials confidential and for using a strong, unique password.'
    ]
  },
  {
    title: '11. International Users',
    body: [
      'Hurammy may process and store information in the United States or other countries. By using Hurammy, you understand that information may be transferred to locations that may have different data protection laws than your location.',
      'Where required, we use appropriate safeguards for international data transfers.'
    ]
  },
  {
    title: '12. Third-Party Links and Services',
    body: [
      'Hurammy may include links, embeds, integrations, or services from third parties. This Privacy Policy does not apply to third-party websites, apps, services, or practices.',
      'Please review the privacy policies of third-party services before providing information to them.'
    ]
  },
  {
    title: '13. Changes to This Privacy Policy',
    body: [
      'We may update this Privacy Policy from time to time. When we make material changes, we may provide notice through Hurammy or by other reasonable means.',
      'Your continued use of Hurammy after an updated Privacy Policy becomes effective means you acknowledge the updated policy.'
    ]
  },
  {
    title: '14. Contact Us',
    body: [
      'Questions or requests about this Privacy Policy may be sent to hurammy.help@gmail.com.'
    ]
  }
];

function Privacy() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '28px 18px 56px' }}>
        <section className="panel" style={{ padding: '28px', display: 'grid', gap: '18px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Link to="/" className="muted" style={{ width: 'fit-content', fontSize: '13px' }}>
              Back to Home
            </Link>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.08 }}>
              Privacy Policy
            </h1>
            <p className="muted" style={{ margin: 0, fontSize: '14px' }}>
              Effective date: June 4, 2026
            </p>
            <p style={{ margin: 0, color: 'rgba(245,247,255,0.88)', maxWidth: '760px' }}>
              This Privacy Policy explains how Hurammy collects, uses, shares, and protects
              information when you use our website, applications, services, contests, campaigns,
              community features, and related tools.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            {sections.map((section) => (
              <section key={section.title} style={{ display: 'grid', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="muted" style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="muted" style={{ margin: 0, fontSize: '12px' }}>
            This page is provided as a general Privacy Policy template for Hurammy and should be
            reviewed by qualified legal counsel before being relied on as legal advice.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Privacy;
