DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = 'f4ddca03-67ad-43ec-bf0b-33ba28c5e295') THEN
    INSERT INTO public.announcements (user_id, title, body, active, starts_at, ends_at) 
    VALUES ('f4ddca03-67ad-43ec-bf0b-33ba28c5e295', 'Status da Integração', 'não aconteceu a integração, ainda não consigo ver o banco de exercícios em minha biblioteca', true, now(), now() + interval '1 year');
  END IF;
END $$;