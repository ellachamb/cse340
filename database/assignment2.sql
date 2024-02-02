-- Q1
INSERT INTO public.account
VALUES (
        1000,
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Q2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1000;
-- Q3
DELETE FROM public.account
WHERE account_id = 1000;
-- Q4
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Q5
SELECT public.inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM public.inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;
-- Q6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');