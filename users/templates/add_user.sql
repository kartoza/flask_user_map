INSERT INTO
  user (guid, name, email, website, role, email_updates, longitude, latitude)
VALUES (
  "{{ guid }}",
  "{{ name }}",
  "{{ email }}" ,
  "{{ website }}",
  {{ role }},
  {{ email_updates }},
  {{ longitude }},
  {{ latitude }});
