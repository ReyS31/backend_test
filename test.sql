SELECT
    auth.user_agent,
    COUNT(auth.id) AS login_attemps,
    COUNT(case when auth.is_success=1 then 1 end) AS login_successes,
    COUNT(case when auth.is_success=0 then 1 end) AS login_fails,
    wlt.balance,
    usr.registered_at,
    usr.username,
    CONCAT(usr.first_name, ' ', usr.last_name) AS full_name,
    usr.date_of_birth,
    usr.street_address,
    usr.city,
    usr.province,
    usr.telephone,
    usr.email
FROM
    users AS usr
    LEFT JOIN auth ON usr.id = auth.user_id
    JOIN wallets AS wlt ON usr.id = wlt.user_id
GROUP BY
    auth.user_agent;