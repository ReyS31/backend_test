SELECT
    auth.user_agent,
    COUNT(auth.id) AS success_login,
    wlt.balance,
    usr.registered_at,
    CONCAT(usr.first_name, ' ', usr.last_name) AS full_name,
    usr.date_of_birth,
    usr.street_address,
    usr.city,
    usr.province,
    usr.telephone,
    usr.email,
    usr.username
FROM
    users AS usr
    LEFT JOIN auth ON usr.id = auth.user_id
    JOIN wallets AS wlt ON usr.id = wlt.user_id
GROUP BY
    auth.user_agent;