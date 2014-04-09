UPDATE event
SET event_type = {{ event_type }},
    name = "{{ name }}",
    organizer = "{{ organizer }}",
    presenter_name = "{{ presenter_name }}",
    contact_email = "{{ contact_email }}",
    date = "{{ date }}",
    description = "{{ description }}",
    number_participant = {{ number_participant }},
    latitude = {{ latitude }},
    longitude = {{ longitude }},
    publish_status = {{ publish_status }}
WHERE guid = "{{ guid }}"
