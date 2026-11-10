-- =============================================================================
-- Degas Concepts CMS — initial content
-- Run once, after schema.sql. Copies the content the site launched with.
-- It only inserts into empty tables, so re-running it will not duplicate rows.
-- Clients are intentionally left empty: add real clients in /admin/clients.
-- =============================================================================

insert into public.site_settings (
  id, name, short_name, tagline, vision, mission, phone, whatsapp, email, linkedin,
  rc_number, working_hours, payment_options
)
values (
  1,
  'Degas Concepts Limited',
  'Degas Concepts',
  'Simplicity and Excellence',
  'To simplify solutions across the tech space with simplicity and excellence.',
  'To be the trusted provider of tech solutions.',
  '+234 901 600 9641',
  'https://wa.me/2349016009641',
  'degasconcept@gmail.com',
  'https://linkedin.com/in/caleb-joshua',
  '[RC_NUMBER]',
  'Mon–Fri, 9:00–18:00 WAT (UTC+1), with overlap for UK/EU and morning US hours',
  'Invoicing in USD, GBP, EUR or NGN; bank transfer, Wise or Payoneer'
)
on conflict (id) do nothing;

insert into public.services (slug, title, icon, summary, description, included, sort_order)
select * from (values
  ('ui-ux-design', 'UI/UX Design', 'PenTool',
   'Intuitive interfaces designed around real user behaviour.',
   'We research, wireframe, and design interfaces that are clear, accessible, and easy to use — turning complex flows into simple experiences.',
   array['User research & journey mapping', 'Wireframes & interactive prototypes', 'Design systems & component libraries', 'Usability testing & iteration'], 1),
  ('web-development', 'Web Design & Development', 'Code2',
   'Fast, secure, and scalable websites and web applications.',
   'From marketing sites to full web applications, we build responsive, performant products using modern, maintainable technology.',
   array['Responsive front-end development', 'Custom web application builds', 'API design & integration', 'Performance & SEO optimization'], 2),
  ('wordpress-development', 'WordPress Development', 'Layout',
   'Custom themes and reliable content-managed websites.',
   'We deliver flexible, easy-to-manage WordPress sites with custom themes, plugins, and integrations tailored to your workflow.',
   array['Custom theme development', 'Plugin configuration & customization', 'Content migration & setup', 'Maintenance & security hardening'], 3),
  ('product-design', 'Product Design', 'Layers',
   'End-to-end design for digital products that scale.',
   'We partner with teams to define, design, and refine digital products — balancing user needs with business goals at every stage.',
   array['Product discovery & strategy', 'Information architecture', 'High-fidelity UI design', 'Design handoff & QA'], 4),
  ('mobile-app-development', 'Mobile App Development', 'Smartphone',
   'Native-quality mobile apps for iOS and Android.',
   'We build cross-platform and native mobile applications that feel fast, reliable, and consistent across devices.',
   array['iOS & Android development', 'Cross-platform builds', 'Push notifications & offline support', 'App store deployment support'], 5),
  ('landing-pages', 'Landing Pages', 'MousePointerClick',
   'Conversion-focused pages that turn visitors into customers.',
   'High-impact landing pages built for launches and campaigns — designed to communicate clearly and convert effectively.',
   array['Conversion-focused copy structure', 'Responsive, fast-loading builds', 'Analytics & tracking setup', 'A/B test-ready layouts'], 6)
) as v(slug, title, icon, summary, description, included, sort_order)
where not exists (select 1 from public.services);

insert into public.core_values (title, icon, description, sort_order)
select * from (values
  ('Transparency', 'ShieldCheck',
   'Clear process and honest pricing. You always know what we are doing, why, and what it costs.', 1),
  ('Integrity', 'Handshake',
   'We do what we say. Commitments are kept and quality is never quietly compromised.', 2),
  ('Reliability', 'Clock',
   'On-time, dependable delivery. We build solutions you can trust to keep running.', 3)
) as v(title, icon, description, sort_order)
where not exists (select 1 from public.core_values);

insert into public.projects (slug, title, category, description, featured, sort_order)
select * from (values
  ('kyc-verification-system', 'KYC Verification System', 'Fintech / Compliance',
   'A secure identity verification platform streamlining customer onboarding and compliance checks.', true, 1),
  ('real-estate-management-system', 'Real Estate Management System', 'Property Tech',
   'A management platform for listings, tenants, and payments with role-based dashboards.', true, 2),
  ('attendance-management-system', 'Attendance Management System', 'Enterprise Tools',
   'A time and attendance system with reporting, scheduling, and real-time tracking.', true, 3),
  ('job-portal-system', 'Job Portal System', 'Web Platform',
   'A job marketplace connecting employers and candidates with search, applications, and profiles.', true, 4),
  ('faith-based-community-app', 'Faith-Based Community App', 'Mobile App',
   'A community mobile app for events, giving, and member engagement built for scale.', false, 5),
  ('payroll-management-system', 'Payroll Management System', 'Enterprise Tools',
   'An automated payroll platform handling salaries, deductions, and compliant reporting.', false, 6)
) as v(slug, title, category, description, featured, sort_order)
where not exists (select 1 from public.projects);

insert into public.team_members (name, role, experience, bio, linkedin, image_url, sort_order)
select * from (values
  ('Caleb Joshua', 'Lead Developer — UI/UX Designer & Web Experience Developer', '5+ years experience',
   'Leads design and web engineering, turning complex requirements into clean, dependable products.',
   'https://linkedin.com/in/caleb-joshua', '/ceo.jpg', 1)
) as v(name, role, experience, bio, linkedin, image_url, sort_order)
where not exists (select 1 from public.team_members);
