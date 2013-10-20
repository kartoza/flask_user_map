INSERT INTO
  user (guid, name, email, is_developer, email_updates, longitude, latitude)
VALUES (
  "{{ guid }}",
  "{{ name }}",
  "{{ email }}" ,
  {{ is_developer }},
  {{ email_updates }},
  {{ longitude }},
  {{ latitude }});
