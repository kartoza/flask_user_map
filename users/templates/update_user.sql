UPDATE user
SET name = "{{ name }}",
    email = "{{ email }}",
    website = "{{ website }}",
    role = {{ role }},
    email_updates = {{ email_updates }},
    longitude = {{ longitude }},
    latitude = {{ latitude }}
WHERE guid = "{{ guid }}"
