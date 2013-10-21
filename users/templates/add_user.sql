INSERT INTO
  user (guid, name, email, role, email_updates, longitude, latitude)
VALUES (
  "{{ guid }}",
  "{{ name }}",
  "{{ email }}" ,
  {{ role }},
  {{ email_updates }},
  {{ longitude }},
  {{ latitude }});
