INSERT INTO
  event (guid, event_type, name, organizer, presenter_name, contact_email,
        date, description, number_participant, longitude, latitude)
VALUES (
  "{{ guid }}",
  {{ event_type }},
  "{{ name }}",
  "{{ organizer }}",
  "{{ presenter_name }}",
  "{{ contact_email }}",
  "{{ date }}",
  "{{ description }}",
  {{ number_participant }},
  {{ longitude }},
  {{ latitude }});
