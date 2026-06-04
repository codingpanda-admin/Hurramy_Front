import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const privacyContent = {
  en: {
    label: 'English',
    back: 'Back to Home',
    title: 'Privacy Policy',
    effective: 'Effective date: June 4, 2026',
    intro: 'This Privacy Policy explains how Hurammy collects, uses, shares, and protects information when you use our website, applications, services, contests, campaigns, community features, and related tools.',
    note: 'This page is provided as a general Privacy Policy template for Hurammy and should be reviewed by qualified legal counsel before being relied on as legal advice.',
    sections: [
      ['1. Information We Collect', [
        'We may collect information you provide directly, including your name, username, email address, password, profile details, support requests, campaign submissions, comments, and other content you choose to upload or share.',
        'We may collect information about your use of Hurammy, including videos viewed, uploads, likes, follows, comments, votes, rankings, flower or coin activity, campaign participation, device information, browser type, IP address, log data, and approximate location derived from technical information.',
        'If you use third-party sign-in or payment services, we may receive information from those providers as permitted by your settings and their policies.'
      ]],
      ['2. How We Use Information', [
        'We use information to operate, maintain, personalize, and improve Hurammy, including account creation, authentication, video hosting, recommendations, search, campaign administration, contest operations, voting, rewards, and customer support.',
        'We may use information to communicate with you about your account, platform updates, security notices, support messages, campaigns, promotions, and policy changes.',
        'We may use information to detect, prevent, and respond to fraud, spam, abuse, vote manipulation, security incidents, illegal activity, and violations of our terms or policies.'
      ]],
      ['3. User Content and Public Information', [
        'Content you submit to public areas of Hurammy may be visible to other users and visitors. This may include videos, thumbnails, usernames, profile details, comments, votes, likes, rankings, campaign entries, and other public activity.',
        'Please avoid posting sensitive personal information or information about others unless you have permission and understand that public content may be viewed, shared, indexed, or copied by others.'
      ]],
      ['4. Cookies and Similar Technologies', [
        'Hurammy may use cookies, local storage, pixels, analytics tools, and similar technologies to keep you signed in, remember preferences such as language selection, measure performance, improve features, and understand platform usage.',
        'You can control cookies through your browser settings, but disabling certain technologies may affect how the website works.'
      ]],
      ['5. How We Share Information', [
        'We may share information with service providers who help us operate Hurammy, such as hosting providers, analytics providers, email providers, payment processors, security tools, content delivery networks, and customer support tools.',
        'We may share information when required by law, legal process, government request, or to protect the rights, safety, and security of Hurammy, our users, or others.',
        'If Hurammy is involved in a merger, acquisition, financing, reorganization, sale of assets, or similar transaction, information may be transferred as part of that transaction.',
        'We do not sell your personal information in the traditional sense. If applicable privacy laws define certain advertising or analytics activities as a sale or sharing, you may have rights to opt out.'
      ]],
      ['6. Payments and Transactions', [
        'If Hurammy offers purchases, paid features, coins, flowers, donations, or other transactions, payment details may be collected and processed by third-party payment providers.',
        'Hurammy may receive transaction confirmations, payment status, purchase history, and related information needed to provide paid features, prevent fraud, and maintain records.'
      ]],
      ['7. Data Retention', [
        'We keep information for as long as needed to provide Hurammy, maintain accounts, comply with legal obligations, resolve disputes, enforce agreements, prevent abuse, and support legitimate business needs.',
        'Public content or cached copies may remain visible for a period of time after deletion, and backups may retain information until they are overwritten or deleted in the ordinary course of business.'
      ]],
      ['8. Your Choices and Rights', [
        'You may be able to access, update, or delete certain account information through your account settings. You may also contact us to request access, correction, deletion, portability, restriction, or objection where applicable law provides those rights.',
        'You can opt out of some communications by using unsubscribe instructions or contacting us. We may still send important transactional, account, security, or legal notices.',
        'Depending on where you live, you may have additional privacy rights under laws such as state, national, or regional privacy regulations.'
      ]],
      ['9. Children and Minors', [
        'Hurammy is not intended for children under the age required by applicable law to use online services without parental consent.',
        'If we learn that we collected personal information from a child without required consent, we will take reasonable steps to delete it. Parents or guardians may contact us with concerns.'
      ]],
      ['10. Security', [
        'We use reasonable administrative, technical, and organizational measures designed to protect information. However, no website, app, transmission, or storage system can be guaranteed to be completely secure.',
        'You are responsible for keeping your account credentials confidential and for using a strong, unique password.'
      ]],
      ['11. International Users', [
        'Hurammy may process and store information in the United States or other countries. By using Hurammy, you understand that information may be transferred to locations that may have different data protection laws than your location.',
        'Where required, we use appropriate safeguards for international data transfers.'
      ]],
      ['12. Third-Party Links and Services', [
        'Hurammy may include links, embeds, integrations, or services from third parties. This Privacy Policy does not apply to third-party websites, apps, services, or practices.',
        'Please review the privacy policies of third-party services before providing information to them.'
      ]],
      ['13. Changes to This Privacy Policy', [
        'We may update this Privacy Policy from time to time. When we make material changes, we may provide notice through Hurammy or by other reasonable means.',
        'Your continued use of Hurammy after an updated Privacy Policy becomes effective means you acknowledge the updated policy.'
      ]],
      ['14. Contact Us', [
        'Questions or requests about this Privacy Policy may be sent to hurammy.help@gmail.com.'
      ]]
    ]
  },
  es: {
    label: 'Espanol',
    back: 'Volver al inicio',
    title: 'Politica de privacidad',
    effective: 'Fecha de vigencia: 4 de junio de 2026',
    intro: 'Esta Politica de privacidad explica como Hurammy recopila, usa, comparte y protege informacion cuando usted usa nuestro sitio web, aplicaciones, servicios, concursos, campanas, funciones comunitarias y herramientas relacionadas.',
    note: 'Esta pagina se proporciona como una plantilla general de Politica de privacidad para Hurammy y debe ser revisada por asesoria legal calificada antes de usarse como asesoramiento legal.',
    sections: [
      ['1. Informacion que recopilamos', [
        'Podemos recopilar informacion que usted proporciona directamente, incluido su nombre, nombre de usuario, direccion de correo electronico, contrasena, detalles de perfil, solicitudes de soporte, envios a campanas, comentarios y otro contenido que decida cargar o compartir.',
        'Podemos recopilar informacion sobre su uso de Hurammy, incluidos videos vistos, cargas, me gusta, seguimientos, comentarios, votos, clasificaciones, actividad de flores o monedas, participacion en campanas, informacion del dispositivo, tipo de navegador, direccion IP, datos de registro y ubicacion aproximada derivada de informacion tecnica.',
        'Si utiliza servicios de inicio de sesion o pago de terceros, podemos recibir informacion de esos proveedores segun lo permitan su configuracion y sus politicas.'
      ]],
      ['2. Como usamos la informacion', [
        'Usamos la informacion para operar, mantener, personalizar y mejorar Hurammy, incluida la creacion de cuentas, autenticacion, alojamiento de videos, recomendaciones, busqueda, administracion de campanas, operaciones de concursos, votacion, recompensas y atencion al cliente.',
        'Podemos usar la informacion para comunicarnos con usted sobre su cuenta, actualizaciones de la plataforma, avisos de seguridad, mensajes de soporte, campanas, promociones y cambios de politicas.',
        'Podemos usar la informacion para detectar, prevenir y responder a fraude, spam, abuso, manipulacion de votos, incidentes de seguridad, actividad ilegal y violaciones de nuestros terminos o politicas.'
      ]],
      ['3. Contenido del usuario e informacion publica', [
        'El contenido que envie a areas publicas de Hurammy puede ser visible para otros usuarios y visitantes. Esto puede incluir videos, miniaturas, nombres de usuario, detalles de perfil, comentarios, votos, me gusta, clasificaciones, entradas de campanas y otra actividad publica.',
        'Evite publicar informacion personal sensible o informacion sobre otras personas a menos que tenga permiso y comprenda que el contenido publico puede ser visto, compartido, indexado o copiado por otros.'
      ]],
      ['4. Cookies y tecnologias similares', [
        'Hurammy puede usar cookies, almacenamiento local, pixeles, herramientas de analisis y tecnologias similares para mantener su sesion iniciada, recordar preferencias como la seleccion de idioma, medir rendimiento, mejorar funciones y comprender el uso de la plataforma.',
        'Puede controlar las cookies mediante la configuracion de su navegador, pero desactivar ciertas tecnologias puede afectar el funcionamiento del sitio web.'
      ]],
      ['5. Como compartimos informacion', [
        'Podemos compartir informacion con proveedores de servicios que nos ayudan a operar Hurammy, como proveedores de alojamiento, analisis, correo electronico, procesamiento de pagos, herramientas de seguridad, redes de distribucion de contenido y atencion al cliente.',
        'Podemos compartir informacion cuando sea requerido por la ley, proceso legal, solicitud gubernamental, o para proteger los derechos, seguridad y proteccion de Hurammy, nuestros usuarios u otras personas.',
        'Si Hurammy participa en una fusion, adquisicion, financiamiento, reorganizacion, venta de activos o transaccion similar, la informacion puede transferirse como parte de esa transaccion.',
        'No vendemos su informacion personal en el sentido tradicional. Si las leyes de privacidad aplicables definen ciertas actividades de publicidad o analisis como venta o intercambio, usted puede tener derechos para excluirse.'
      ]],
      ['6. Pagos y transacciones', [
        'Si Hurammy ofrece compras, funciones pagadas, monedas, flores, donaciones u otras transacciones, los detalles de pago pueden ser recopilados y procesados por proveedores de pago externos.',
        'Hurammy puede recibir confirmaciones de transacciones, estado de pago, historial de compras e informacion relacionada necesaria para proporcionar funciones pagadas, prevenir fraude y mantener registros.'
      ]],
      ['7. Retencion de datos', [
        'Conservamos informacion durante el tiempo necesario para proporcionar Hurammy, mantener cuentas, cumplir obligaciones legales, resolver disputas, hacer cumplir acuerdos, prevenir abusos y respaldar necesidades comerciales legitimas.',
        'El contenido publico o copias en cache pueden permanecer visibles durante un periodo despues de la eliminacion, y las copias de seguridad pueden conservar informacion hasta que sean sobrescritas o eliminadas en el curso ordinario del negocio.'
      ]],
      ['8. Sus opciones y derechos', [
        'Puede acceder, actualizar o eliminar cierta informacion de cuenta mediante la configuracion de su cuenta. Tambien puede contactarnos para solicitar acceso, correccion, eliminacion, portabilidad, restriccion u oposicion cuando la ley aplicable otorgue esos derechos.',
        'Puede optar por no recibir algunas comunicaciones usando las instrucciones de cancelacion de suscripcion o contactandonos. Aun podemos enviar avisos importantes transaccionales, de cuenta, seguridad o legales.',
        'Dependiendo de donde viva, puede tener derechos de privacidad adicionales bajo leyes estatales, nacionales o regionales.'
      ]],
      ['9. Ninos y menores', [
        'Hurammy no esta destinado a ninos menores de la edad requerida por la ley aplicable para usar servicios en linea sin consentimiento parental.',
        'Si sabemos que recopilamos informacion personal de un nino sin el consentimiento requerido, tomaremos medidas razonables para eliminarla. Los padres o tutores pueden contactarnos si tienen inquietudes.'
      ]],
      ['10. Seguridad', [
        'Usamos medidas administrativas, tecnicas y organizativas razonables disenadas para proteger la informacion. Sin embargo, ningun sitio web, aplicacion, transmision o sistema de almacenamiento puede garantizarse como completamente seguro.',
        'Usted es responsable de mantener confidenciales sus credenciales de cuenta y de usar una contrasena fuerte y unica.'
      ]],
      ['11. Usuarios internacionales', [
        'Hurammy puede procesar y almacenar informacion en los Estados Unidos u otros paises. Al usar Hurammy, usted entiende que la informacion puede transferirse a lugares que pueden tener leyes de proteccion de datos diferentes a las de su ubicacion.',
        'Cuando sea requerido, usamos salvaguardas apropiadas para transferencias internacionales de datos.'
      ]],
      ['12. Enlaces y servicios de terceros', [
        'Hurammy puede incluir enlaces, inserciones, integraciones o servicios de terceros. Esta Politica de privacidad no se aplica a sitios web, aplicaciones, servicios o practicas de terceros.',
        'Revise las politicas de privacidad de los servicios de terceros antes de proporcionarles informacion.'
      ]],
      ['13. Cambios a esta Politica de privacidad', [
        'Podemos actualizar esta Politica de privacidad ocasionalmente. Cuando realicemos cambios materiales, podemos notificarlo a traves de Hurammy o por otros medios razonables.',
        'Su uso continuo de Hurammy despues de que una Politica de privacidad actualizada entre en vigor significa que reconoce la politica actualizada.'
      ]],
      ['14. Contactenos', [
        'Las preguntas o solicitudes sobre esta Politica de privacidad pueden enviarse a hurammy.help@gmail.com.'
      ]]
    ]
  },
  zh: {
    label: '中文',
    back: '返回首页',
    title: '隐私政策',
    effective: '生效日期：2026年6月4日',
    intro: '本隐私政策说明当您使用我们的网站、应用程序、服务、比赛、活动、社区功能和相关工具时，Hurammy 如何收集、使用、分享和保护信息。',
    note: '本页面作为 Hurammy 的一般隐私政策模板提供，在作为法律意见依赖之前，应由合格的法律顾问进行审阅。',
    sections: [
      ['1. 我们收集的信息', [
        '我们可能收集您直接提供的信息，包括姓名、用户名、电子邮件地址、密码、个人资料详情、支持请求、活动提交、评论以及您选择上传或分享的其他内容。',
        '我们可能收集有关您使用 Hurammy 的信息，包括观看的视频、上传、点赞、关注、评论、投票、排名、鲜花或金币活动、活动参与、设备信息、浏览器类型、IP 地址、日志数据以及根据技术信息推断的大致位置。',
        '如果您使用第三方登录或支付服务，我们可能会按照您的设置和这些服务商的政策，从其处接收信息。'
      ]],
      ['2. 我们如何使用信息', [
        '我们使用信息来运营、维护、个性化和改进 Hurammy，包括账户创建、身份验证、视频托管、推荐、搜索、活动管理、比赛运营、投票、奖励和客户支持。',
        '我们可能使用信息与您沟通账户、平台更新、安全通知、支持消息、活动、促销和政策变更。',
        '我们可能使用信息来发现、预防和应对欺诈、垃圾信息、滥用、投票操纵、安全事件、非法活动以及违反我们条款或政策的行为。'
      ]],
      ['3. 用户内容和公开信息', [
        '您提交到 Hurammy 公开区域的内容可能对其他用户和访问者可见。这可能包括视频、缩略图、用户名、个人资料详情、评论、投票、点赞、排名、活动参赛内容以及其他公开活动。',
        '除非您获得许可并理解公开内容可能被他人查看、分享、索引或复制，否则请避免发布敏感个人信息或他人信息。'
      ]],
      ['4. Cookies 和类似技术', [
        'Hurammy 可能使用 cookies、本地存储、像素、分析工具和类似技术，以保持登录状态、记住语言选择等偏好、衡量性能、改进功能并了解平台使用情况。',
        '您可以通过浏览器设置控制 cookies，但禁用某些技术可能会影响网站的运行。'
      ]],
      ['5. 我们如何分享信息', [
        '我们可能与帮助我们运营 Hurammy 的服务提供商分享信息，例如托管服务商、分析服务商、电子邮件服务商、支付处理商、安全工具、内容分发网络和客户支持工具。',
        '当法律、法律程序、政府请求要求，或为保护 Hurammy、我们的用户或他人的权利、安全和保障时，我们可能分享信息。',
        '如果 Hurammy 涉及合并、收购、融资、重组、资产出售或类似交易，信息可能作为该交易的一部分被转移。',
        '我们不会以传统意义出售您的个人信息。如果适用隐私法律将某些广告或分析活动定义为出售或分享，您可能拥有选择退出的权利。'
      ]],
      ['6. 付款和交易', [
        '如果 Hurammy 提供购买、付费功能、金币、鲜花、捐赠或其他交易，付款详情可能由第三方支付服务商收集和处理。',
        'Hurammy 可能接收交易确认、付款状态、购买历史以及提供付费功能、防止欺诈和保存记录所需的相关信息。'
      ]],
      ['7. 数据保留', [
        '我们会在提供 Hurammy、维护账户、履行法律义务、解决争议、执行协议、防止滥用和支持合法业务需求所需的期间保留信息。',
        '公开内容或缓存副本在删除后可能仍会显示一段时间，备份也可能保留信息，直到在正常业务过程中被覆盖或删除。'
      ]],
      ['8. 您的选择和权利', [
        '您可以通过账户设置访问、更新或删除某些账户信息。在适用法律提供相关权利的情况下，您也可以联系我们请求访问、更正、删除、携带、限制或反对处理。',
        '您可以通过退订说明或联系我们来选择不接收某些通信。我们仍可能发送重要的交易、账户、安全或法律通知。',
        '根据您的居住地，您可能根据州、国家或地区隐私法规享有额外隐私权利。'
      ]],
      ['9. 儿童和未成年人', [
        'Hurammy 不面向低于适用法律规定可在无父母同意情况下使用在线服务年龄的儿童。',
        '如果我们发现未经所需同意收集了儿童的个人信息，我们将采取合理措施删除该信息。父母或监护人如有疑虑可联系我们。'
      ]],
      ['10. 安全', [
        '我们采用合理的行政、技术和组织措施来保护信息。但是，没有任何网站、应用程序、传输或存储系统可以保证完全安全。',
        '您有责任保护账户凭证的机密性，并使用强且唯一的密码。'
      ]],
      ['11. 国际用户', [
        'Hurammy 可能在美国或其他国家处理和存储信息。使用 Hurammy 即表示您理解信息可能被转移到数据保护法律不同于您所在地的地区。',
        '在需要时，我们会对国际数据传输采取适当保护措施。'
      ]],
      ['12. 第三方链接和服务', [
        'Hurammy 可能包含第三方链接、嵌入内容、集成或服务。本隐私政策不适用于第三方网站、应用程序、服务或做法。',
        '在向第三方服务提供信息前，请查阅其隐私政策。'
      ]],
      ['13. 本隐私政策的变更', [
        '我们可能不时更新本隐私政策。当我们作出重大变更时，可能会通过 Hurammy 或其他合理方式提供通知。',
        '更新后的隐私政策生效后，您继续使用 Hurammy 即表示您确认该更新政策。'
      ]],
      ['14. 联系我们', [
        '有关本隐私政策的问题或请求可发送至 hurammy.help@gmail.com。'
      ]]
    ]
  }
};

const tabOrder = ['en', 'es', 'zh'];

const getInitialPrivacyLanguage = () => {
  const savedLang = localStorage.getItem('appLanguage') || 'en';
  return tabOrder.includes(savedLang) ? savedLang : 'en';
};

function Privacy() {
  const [activeLang, setActiveLang] = useState(getInitialPrivacyLanguage);
  const content = privacyContent[activeLang];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '28px 18px 56px' }}>
        <section className="panel" style={{ padding: '28px', display: 'grid', gap: '18px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Link to="/" className="muted" style={{ width: 'fit-content', fontSize: '13px' }}>
              {content.back}
            </Link>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.08 }}>
              {content.title}
            </h1>
            <p className="muted" style={{ margin: 0, fontSize: '14px' }}>
              {content.effective}
            </p>
            <p style={{ margin: 0, color: 'rgba(245,247,255,0.88)', maxWidth: '760px' }}>
              {content.intro}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Privacy policy language"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '6px',
              border: '1px solid var(--line)',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.04)',
              width: 'fit-content',
              maxWidth: '100%',
            }}
          >
            {tabOrder.map((lang) => {
              const isActive = activeLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveLang(lang)}
                  className={isActive ? 'btn primary' : 'btn'}
                  style={{
                    padding: '8px 12px',
                    minWidth: '96px',
                    boxShadow: isActive ? undefined : 'none',
                  }}
                >
                  {privacyContent[lang].label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            {content.sections.map(([title, body]) => (
              <section key={title} style={{ display: 'grid', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>{title}</h2>
                {body.map((paragraph) => (
                  <p key={paragraph} className="muted" style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="muted" style={{ margin: 0, fontSize: '12px' }}>
            {content.note}
          </p>

          <Link to="/" className="btn primary" style={{ justifySelf: 'center' }}>
            {content.back}
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Privacy;
