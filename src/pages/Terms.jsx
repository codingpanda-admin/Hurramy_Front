import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const termsContent = {
  en: {
    label: 'English',
    back: 'Back to Home',
    title: 'Terms of Service',
    effective: 'Effective date: June 4, 2026',
    intro: 'Welcome to Hurammy. These Terms of Service explain the rules for using our website, applications, services, contests, campaigns, community features, and related tools.',
    note: 'This page is provided as a general Terms of Service template for Hurammy and should be reviewed by qualified legal counsel before being relied on as legal advice.',
    sections: [
      ['1. Acceptance of Terms', [
        'By accessing or using Hurammy, you agree to these Terms of Service and any policies referenced here. If you do not agree, do not use the platform.',
        'These terms apply to all visitors, registered users, creators, contestants, voters, and any other person who accesses Hurammy.'
      ]],
      ['2. Eligibility', [
        'You must be legally able to enter into these terms. If you are under the age of majority where you live, you may use Hurammy only with permission and supervision from a parent or legal guardian.',
        'You are responsible for making sure your use of Hurammy complies with all laws and rules that apply to you.'
      ]],
      ['3. Accounts and Security', [
        'You agree to provide accurate account information and keep it updated. You are responsible for maintaining the confidentiality of your login credentials.',
        'You are responsible for all activity under your account. If you believe your account has been accessed without permission, contact us promptly.'
      ]],
      ['4. User Content', [
        'Hurammy may allow you to upload, post, share, vote on, comment on, or otherwise submit content, including videos, images, text, audio, profile information, and campaign materials.',
        'You keep ownership of content you submit. By submitting content, you grant Hurammy a worldwide, non-exclusive, royalty-free license to host, store, display, reproduce, modify for technical formatting, distribute, promote, and otherwise use that content in connection with operating, improving, and marketing the platform and related campaigns.',
        'You represent that you own or have all required rights and permissions for content you submit, including any music, images, video, voice, likeness, trademarks, or other third-party materials included in it.'
      ]],
      ['5. Prohibited Conduct', [
        'You may not upload or share unlawful, harmful, abusive, defamatory, hateful, sexually exploitative, violent, misleading, infringing, or otherwise inappropriate content.',
        'You may not harass others, impersonate any person or entity, manipulate votes or rankings, use bots or automated abuse, interfere with platform security, scrape the service without permission, or attempt to access accounts, systems, or data you are not authorized to access.',
        'Hurammy may remove or restrict content, suspend accounts, or take other action if we believe these terms or applicable laws have been violated.'
      ]],
      ['6. Campaigns, Contests, Voting, and Rewards', [
        'Campaigns, contests, voting, awards, rankings, flowers, coins, or similar features may have additional rules, eligibility requirements, judging criteria, deadlines, or limitations.',
        'Hurammy may modify, pause, cancel, disqualify entries from, or adjust campaigns or contests when needed to protect fairness, comply with law, address technical issues, or prevent abuse.',
        'Rewards, virtual items, credits, points, flowers, or coins may have no cash value unless expressly stated in writing. They may be changed, revoked, limited, or discontinued as allowed by applicable law.'
      ]],
      ['7. Payments and Purchases', [
        'If Hurammy offers paid features, you agree to pay all applicable fees, taxes, and charges. Payments may be processed by third-party payment providers subject to their own terms.',
        'Except where required by law or expressly stated, purchases may be final and non-refundable.'
      ]],
      ['8. Intellectual Property', [
        'Hurammy, including its design, logos, software, features, graphics, and platform content, is owned by Hurammy or its licensors and is protected by intellectual property laws.',
        'You may not copy, modify, distribute, sell, lease, reverse engineer, or exploit any part of Hurammy except as permitted by these terms or with written permission.'
      ]],
      ['9. Privacy', [
        'Your use of Hurammy is also governed by our Privacy Policy. Please review it to understand how information may be collected, used, and shared.',
        'If you submit content that includes another person, you are responsible for obtaining any required consent from that person.'
      ]],
      ['10. Third-Party Services and Links', [
        'Hurammy may include links, embeds, integrations, or services provided by third parties. We are not responsible for third-party websites, services, content, policies, or practices.',
        'Your use of third-party services may be subject to separate terms and privacy policies.'
      ]],
      ['11. Disclaimers', [
        'Hurammy is provided on an "as is" and "as available" basis. We do not guarantee that the platform will be uninterrupted, secure, error-free, or available at all times.',
        'We do not guarantee any specific audience, ranking, income, reward, result, or outcome from using Hurammy or participating in any campaign or contest.'
      ]],
      ['12. Limitation of Liability', [
        'To the fullest extent permitted by law, Hurammy and its owners, employees, partners, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, or business interruption.',
        'Our total liability for any claim related to Hurammy will be limited to the amount you paid to Hurammy for the service giving rise to the claim during the twelve months before the claim, or one hundred U.S. dollars, whichever is greater.'
      ]],
      ['13. Indemnification', [
        'You agree to defend, indemnify, and hold harmless Hurammy and its owners, employees, partners, and service providers from claims, damages, losses, liabilities, costs, and expenses arising from your content, your use of the platform, or your violation of these terms or applicable law.'
      ]],
      ['14. Termination', [
        'You may stop using Hurammy at any time. Hurammy may suspend or terminate your access if we believe you violated these terms, created risk for the platform or other users, or if continued access is not commercially or legally practical.',
        'Sections that by their nature should survive termination will continue to apply, including ownership, licenses, disclaimers, limitation of liability, and indemnification.'
      ]],
      ['15. Changes to These Terms', [
        'We may update these terms from time to time. When we make material changes, we may provide notice through the platform or by other reasonable means.',
        'Your continued use of Hurammy after updated terms become effective means you accept the updated terms.'
      ]],
      ['16. Contact', [
        'Questions about these Terms of Service may be sent to hurammy.help@gmail.com.'
      ]]
    ]
  },
  es: {
    label: 'Espanol',
    back: 'Volver al inicio',
    title: 'Terminos de servicio',
    effective: 'Fecha de vigencia: 4 de junio de 2026',
    intro: 'Bienvenido a Hurammy. Estos Terminos de servicio explican las reglas para usar nuestro sitio web, aplicaciones, servicios, concursos, campanas, funciones comunitarias y herramientas relacionadas.',
    note: 'Esta pagina se proporciona como una plantilla general de Terminos de servicio para Hurammy y debe ser revisada por asesoria legal calificada antes de usarse como asesoramiento legal.',
    sections: [
      ['1. Aceptacion de los terminos', [
        'Al acceder o usar Hurammy, usted acepta estos Terminos de servicio y cualquier politica mencionada aqui. Si no esta de acuerdo, no use la plataforma.',
        'Estos terminos se aplican a todos los visitantes, usuarios registrados, creadores, concursantes, votantes y cualquier otra persona que acceda a Hurammy.'
      ]],
      ['2. Elegibilidad', [
        'Debe tener capacidad legal para aceptar estos terminos. Si es menor de edad segun las leyes de su lugar de residencia, solo puede usar Hurammy con permiso y supervision de un padre, madre o tutor legal.',
        'Usted es responsable de asegurarse de que su uso de Hurammy cumpla con todas las leyes y normas aplicables.'
      ]],
      ['3. Cuentas y seguridad', [
        'Usted acepta proporcionar informacion de cuenta precisa y mantenerla actualizada. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso.',
        'Usted es responsable de toda actividad realizada desde su cuenta. Si cree que su cuenta fue accedida sin autorizacion, contactenos de inmediato.'
      ]],
      ['4. Contenido del usuario', [
        'Hurammy puede permitirle cargar, publicar, compartir, votar, comentar o enviar contenido, incluidos videos, imagenes, texto, audio, informacion de perfil y materiales de campanas.',
        'Usted conserva la propiedad del contenido que envia. Al enviar contenido, otorga a Hurammy una licencia mundial, no exclusiva y libre de regalias para alojar, almacenar, mostrar, reproducir, modificar por razones tecnicas de formato, distribuir, promocionar y usar dicho contenido en relacion con la operacion, mejora y promocion de la plataforma y campanas relacionadas.',
        'Usted declara que posee o cuenta con todos los derechos y permisos necesarios para el contenido que envia, incluida musica, imagenes, video, voz, imagen personal, marcas u otros materiales de terceros.'
      ]],
      ['5. Conducta prohibida', [
        'No puede cargar ni compartir contenido ilegal, danino, abusivo, difamatorio, de odio, sexualmente explotador, violento, enganoso, infractor o inapropiado.',
        'No puede acosar a otros, suplantar personas o entidades, manipular votos o clasificaciones, usar bots o automatizacion abusiva, interferir con la seguridad de la plataforma, extraer datos sin permiso ni intentar acceder a cuentas, sistemas o datos no autorizados.',
        'Hurammy puede eliminar o restringir contenido, suspender cuentas o tomar otras medidas si creemos que se han violado estos terminos o las leyes aplicables.'
      ]],
      ['6. Campanas, concursos, votacion y recompensas', [
        'Las campanas, concursos, votaciones, premios, clasificaciones, flores, monedas o funciones similares pueden tener reglas adicionales, requisitos de elegibilidad, criterios de evaluacion, plazos o limitaciones.',
        'Hurammy puede modificar, pausar, cancelar, descalificar entradas o ajustar campanas o concursos cuando sea necesario para proteger la equidad, cumplir la ley, resolver problemas tecnicos o prevenir abusos.',
        'Las recompensas, articulos virtuales, creditos, puntos, flores o monedas pueden no tener valor monetario salvo que se indique expresamente por escrito. Pueden modificarse, revocarse, limitarse o discontinuarse segun lo permita la ley aplicable.'
      ]],
      ['7. Pagos y compras', [
        'Si Hurammy ofrece funciones pagadas, usted acepta pagar todas las tarifas, impuestos y cargos aplicables. Los pagos pueden ser procesados por proveedores externos sujetos a sus propios terminos.',
        'Salvo que lo exija la ley o se indique expresamente, las compras pueden ser finales y no reembolsables.'
      ]],
      ['8. Propiedad intelectual', [
        'Hurammy, incluido su diseno, logotipos, software, funciones, graficos y contenido de la plataforma, pertenece a Hurammy o a sus licenciantes y esta protegido por leyes de propiedad intelectual.',
        'No puede copiar, modificar, distribuir, vender, arrendar, realizar ingenieria inversa ni explotar ninguna parte de Hurammy salvo segun lo permitan estos terminos o con autorizacion escrita.'
      ]],
      ['9. Privacidad', [
        'Su uso de Hurammy tambien se rige por nuestra Politica de privacidad. Revisela para entender como se puede recopilar, usar y compartir informacion.',
        'Si envia contenido que incluye a otra persona, usted es responsable de obtener cualquier consentimiento requerido de esa persona.'
      ]],
      ['10. Servicios y enlaces de terceros', [
        'Hurammy puede incluir enlaces, inserciones, integraciones o servicios proporcionados por terceros. No somos responsables de sitios web, servicios, contenido, politicas o practicas de terceros.',
        'Su uso de servicios de terceros puede estar sujeto a terminos y politicas de privacidad separados.'
      ]],
      ['11. Descargos de responsabilidad', [
        'Hurammy se proporciona "tal cual" y "segun disponibilidad". No garantizamos que la plataforma sea ininterrumpida, segura, libre de errores o disponible en todo momento.',
        'No garantizamos ninguna audiencia, clasificacion, ingreso, recompensa, resultado u objetivo especifico por usar Hurammy o participar en una campana o concurso.'
      ]],
      ['12. Limitacion de responsabilidad', [
        'En la maxima medida permitida por la ley, Hurammy y sus propietarios, empleados, socios y proveedores de servicios no seran responsables por danos indirectos, incidentales, especiales, consecuentes, ejemplares o punitivos, ni por lucro cesante, perdida de datos o interrupcion comercial.',
        'Nuestra responsabilidad total por cualquier reclamo relacionado con Hurammy se limitara al monto que usted pago a Hurammy por el servicio que dio lugar al reclamo durante los doce meses anteriores al reclamo, o cien dolares estadounidenses, lo que sea mayor.'
      ]],
      ['13. Indemnizacion', [
        'Usted acepta defender, indemnizar y mantener indemne a Hurammy y a sus propietarios, empleados, socios y proveedores de servicios frente a reclamos, danos, perdidas, responsabilidades, costos y gastos derivados de su contenido, su uso de la plataforma o su violacion de estos terminos o de la ley aplicable.'
      ]],
      ['14. Terminacion', [
        'Puede dejar de usar Hurammy en cualquier momento. Hurammy puede suspender o terminar su acceso si creemos que violo estos terminos, creo riesgos para la plataforma u otros usuarios, o si continuar el acceso no es comercial o legalmente viable.',
        'Las secciones que por su naturaleza deban sobrevivir a la terminacion seguiran aplicandose, incluidas propiedad, licencias, descargos, limitacion de responsabilidad e indemnizacion.'
      ]],
      ['15. Cambios a estos terminos', [
        'Podemos actualizar estos terminos ocasionalmente. Cuando realicemos cambios materiales, podemos notificarlo a traves de la plataforma o por otros medios razonables.',
        'Su uso continuo de Hurammy despues de que los terminos actualizados entren en vigor significa que acepta los terminos actualizados.'
      ]],
      ['16. Contacto', [
        'Las preguntas sobre estos Terminos de servicio pueden enviarse a hurammy.help@gmail.com.'
      ]]
    ]
  },
  zh: {
    label: '中文',
    back: '返回首页',
    title: '服务条款',
    effective: '生效日期：2026年6月4日',
    intro: '欢迎使用 Hurammy。本服务条款说明您使用我们的网站、应用程序、服务、比赛、活动、社区功能和相关工具时应遵守的规则。',
    note: '本页面作为 Hurammy 的一般服务条款模板提供，在作为法律意见依赖之前，应由合格的法律顾问进行审阅。',
    sections: [
      ['1. 接受条款', [
        '访问或使用 Hurammy 即表示您同意本服务条款以及此处引用的任何政策。如果您不同意，请不要使用本平台。',
        '本条款适用于所有访问者、注册用户、创作者、参赛者、投票者以及任何访问 Hurammy 的其他人员。'
      ]],
      ['2. 资格', [
        '您必须具备接受本条款的法律能力。如果您未达到所在地法律规定的成年年龄，您只能在父母或法定监护人许可和监督下使用 Hurammy。',
        '您有责任确保您对 Hurammy 的使用符合所有适用的法律和规则。'
      ]],
      ['3. 账户与安全', [
        '您同意提供准确的账户信息并保持更新。您有责任保护登录凭证的机密性。',
        '您应对您账户下的所有活动负责。如果您认为账户被未经授权访问，请及时联系我们。'
      ]],
      ['4. 用户内容', [
        'Hurammy 可能允许您上传、发布、分享、投票、评论或提交内容，包括视频、图片、文字、音频、个人资料信息和活动材料。',
        '您保留您提交内容的所有权。提交内容即表示您授予 Hurammy 一项全球性、非排他、免版税的许可，用于托管、存储、展示、复制、为技术格式调整而修改、分发、推广以及在运营、改进和营销本平台及相关活动时使用该内容。',
        '您声明您拥有或已取得提交内容所需的所有权利和许可，包括其中包含的音乐、图片、视频、声音、肖像、商标或其他第三方材料。'
      ]],
      ['5. 禁止行为', [
        '您不得上传或分享违法、有害、辱骂、诽谤、仇恨、性剥削、暴力、误导、侵权或其他不适当内容。',
        '您不得骚扰他人、冒充任何个人或实体、操纵投票或排名、使用机器人或自动化滥用、干扰平台安全、未经许可抓取服务，或试图访问您无权访问的账户、系统或数据。',
        '如果我们认为本条款或适用法律被违反，Hurammy 可以删除或限制内容、暂停账户或采取其他措施。'
      ]],
      ['6. 活动、比赛、投票和奖励', [
        '活动、比赛、投票、奖项、排名、鲜花、金币或类似功能可能有额外规则、资格要求、评审标准、截止日期或限制。',
        '为保护公平性、遵守法律、处理技术问题或防止滥用，Hurammy 可在必要时修改、暂停、取消活动或比赛，取消参赛资格或进行调整。',
        '奖励、虚拟物品、积分、点数、鲜花或金币除非以书面形式明确说明，否则可能不具有现金价值。它们可在适用法律允许的范围内被更改、撤销、限制或停止。'
      ]],
      ['7. 付款和购买', [
        '如果 Hurammy 提供付费功能，您同意支付所有适用费用、税款和收费。付款可能由第三方支付服务商处理，并受其自身条款约束。',
        '除法律要求或明确说明外，购买可能为最终交易且不可退款。'
      ]],
      ['8. 知识产权', [
        'Hurammy，包括其设计、标识、软件、功能、图形和平台内容，归 Hurammy 或其许可方所有，并受知识产权法律保护。',
        '除本条款允许或获得书面许可外，您不得复制、修改、分发、出售、出租、反向工程或利用 Hurammy 的任何部分。'
      ]],
      ['9. 隐私', [
        '您对 Hurammy 的使用也受我们的隐私政策约束。请查阅该政策以了解信息可能如何被收集、使用和分享。',
        '如果您提交的内容包含他人，您有责任取得该人员所需的任何同意。'
      ]],
      ['10. 第三方服务和链接', [
        'Hurammy 可能包含由第三方提供的链接、嵌入内容、集成或服务。我们不对第三方网站、服务、内容、政策或做法负责。',
        '您对第三方服务的使用可能受其单独的条款和隐私政策约束。'
      ]],
      ['11. 免责声明', [
        'Hurammy 按“现状”和“可用”基础提供。我们不保证平台不会中断、安全、无错误或始终可用。',
        '我们不保证您使用 Hurammy 或参与任何活动或比赛会获得特定观众、排名、收入、奖励、结果或成果。'
      ]],
      ['12. 责任限制', [
        '在法律允许的最大范围内，Hurammy 及其所有者、员工、合作伙伴和服务提供商不对间接、附带、特殊、后果性、惩戒性或惩罚性损害负责，也不对利润损失、数据丢失或业务中断负责。',
        '我们就任何与 Hurammy 相关的索赔承担的总责任，以您在索赔发生前十二个月内为引发该索赔的服务向 Hurammy 支付的金额或一百美元中较高者为限。'
      ]],
      ['13. 赔偿', [
        '您同意为 Hurammy 及其所有者、员工、合作伙伴和服务提供商辩护、赔偿并使其免受因您的内容、您使用平台、或您违反本条款或适用法律而产生的索赔、损害、损失、责任、费用和开支。'
      ]],
      ['14. 终止', [
        '您可以随时停止使用 Hurammy。如果我们认为您违反本条款、给平台或其他用户造成风险，或继续提供访问在商业或法律上不可行，Hurammy 可以暂停或终止您的访问。',
        '按其性质应在终止后继续有效的条款将继续适用，包括所有权、许可、免责声明、责任限制和赔偿。'
      ]],
      ['15. 条款变更', [
        '我们可能不时更新本条款。当我们作出重大变更时，可能会通过平台或其他合理方式提供通知。',
        '更新后的条款生效后，您继续使用 Hurammy 即表示您接受更新后的条款。'
      ]],
      ['16. 联系方式', [
        '有关本服务条款的问题可发送至 hurammy.help@gmail.com。'
      ]]
    ]
  }
};

const tabOrder = ['en', 'es', 'zh'];

const getInitialTermsLanguage = () => {
  const savedLang = localStorage.getItem('appLanguage') || 'en';
  return tabOrder.includes(savedLang) ? savedLang : 'en';
};

function Terms() {
  const [activeLang, setActiveLang] = useState(getInitialTermsLanguage);
  const content = termsContent[activeLang];

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
            aria-label="Terms language"
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
                  {termsContent[lang].label}
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

export default Terms;
