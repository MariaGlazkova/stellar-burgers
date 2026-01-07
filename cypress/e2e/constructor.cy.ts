describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.dismissDevServerOverlay();
  });

  it('должна загружаться страница конструктора', () => {
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('должны отображаться ингредиенты', () => {
    // Проверяем наличие категорий ингредиентов
    cy.contains('Булки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
    cy.contains('Начинки').should('be.visible');
  });

  it('должна отображаться пустая область конструктора', () => {
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });

  it('должна добавляться булка в конструктор при клике на кнопку "Добавить"', () => {
    // Кликаем "Добавить" строго в списке ингредиентов
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Краторная булка N-200i'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Проверяем, что булка добавлена строго в конструкторе
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });
  });

  it('должна добавляться начинка в конструктор при клике на кнопку "Добавить"', () => {
    // Добавляем булку (кликаем "Добавить" строго в списке ингредиентов)
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Краторная булка N-200i'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Добавляем начинку (кликаем "Добавить" строго в списке ингредиентов)
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Биокотлета из марсианской Магнолии'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Проверяем, что начинка добавлена строго в конструкторе
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });
  });

  it('должна отображаться цена заказа', () => {
    // Добавляем булку (кликаем "Добавить" строго в списке ингредиентов)
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Краторная булка N-200i'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Проверяем наличие цены строго в конструкторе (цена булки * 2)
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('2510').should('be.visible');
    });
  });

  it('кнопка "Оформить заказ" должна быть видима', () => {
    cy.get('[data-cy="burger-constructor"]')
      .contains('Оформить заказ')
      .should('be.visible');
  });

  it('при клике на "Оформить заказ" без авторизации должен происходить редирект на страницу входа', () => {
    // Добавляем булку
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Краторная булка N-200i'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Кликаем на кнопку оформления заказа строго в конструкторе
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Оформить заказ').click();
    });

    // Проверяем редирект на страницу входа
    cy.url().should('include', '/login');
  });

  it('должен открываться модальный ингредиент при клике на ингредиент', () => {
    // Кликаем на ингредиент строго в списке ингредиентов (в ссылку карточки)
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains('[data-cy="ingredient-card"]', 'Краторная булка N-200i')
        .find('[data-cy="ingredient-link"]')
        .click();
    });

    // Ждем, пока модальное окно откроется (контент рендерится в портал #modals)
    // В портале два div: [0] модалка, [1] overlay
    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Детали ингредиента').should('be.visible');
        cy.contains('Краторная булка N-200i').should('be.visible');

        // Проверяем отображение деталей ингредиента внутри модального окна
        cy.contains('Калории, ккал').should('be.visible');
        cy.contains('420').should('be.visible');
        cy.contains('Белки, г').should('be.visible');
        cy.contains('80').should('be.visible');
        cy.contains('Жиры, г').should('be.visible');
        cy.contains('24').should('be.visible');
        cy.contains('Углеводы, г').should('be.visible');
        cy.contains('53').should('be.visible');
      });
  });

  it('должен закрываться модальный ингредиент при клике на крестик', () => {
    // Открываем модальное окно
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains('[data-cy="ingredient-card"]', 'Краторная булка N-200i')
        .find('[data-cy="ingredient-link"]')
        .click();
    });

    // Ждем, пока модальное окно откроется
    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
    });

    // Закрываем модальное окно через кнопку закрытия
    cy.get('[data-cy="modal"]').within(() => {
      cy.get('button').first().click();
    });

    // Проверяем, что модальное окно закрыто
    cy.get('#modals').should('be.empty');
  });

  it('должен закрываться модальный ингредиент при клике на overlay', () => {
    // Открываем модальное окно
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains('[data-cy="ingredient-card"]', 'Краторная булка N-200i')
        .find('[data-cy="ingredient-link"]')
        .click();
    });

    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
    });

    // Кликаем по overlay (внутри портала это второй div-ребенок)
    // Кликаем в topLeft, чтобы не попасть в область, перекрытую модальным контентом
    cy.get('[data-cy="modal-overlay"]').click('topLeft', { force: true });

    // Проверяем, что модальное окно закрыто
    cy.get('#modals').should('be.empty');
  });

  it('должна обновляться цена при добавлении ингредиентов', () => {
    // Добавляем булку (цена 1255 * 2 = 2510)
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Краторная булка N-200i'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Проверяем цену в конструкторе (цена булки * 2)
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('2510').should('be.visible');
    });

    // Добавляем начинку (цена 424)
    cy.get('[data-cy="burger-ingredients"]').within(() => {
      cy.contains(
        '[data-cy="ingredient-card"]',
        'Биокотлета из марсианской Магнолии'
      ).within(() => {
        cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
      });
    });

    // Проверяем обновленную цену в конструкторе (2510 + 424 = 2934)
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('2934').should('be.visible');
    });
  });

  describe('Процесс создания заказа', () => {
    beforeEach(() => {
      // Перехват запроса пользователя
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );

      // Фейковые токены ДО загрузки страницы
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      });
      cy.setCookie('accessToken', 'fake-access-token');

      // Теперь приложение само вызовет fetchUser() на старте (см. AppContent),
      // поэтому просто ждем @getUser
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
      cy.dismissDevServerOverlay();
      cy.contains('Соберите бургер').should('be.visible');
    });

    afterEach(() => {
      // Очищаем токены после теста
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookies();
    });

    it('должен создавать заказ, отображать модальное окно с номером заказа и очищать конструктор', () => {
      // Добавляем булку
      cy.get('[data-cy="burger-ingredients"]').within(() => {
        cy.contains(
          '[data-cy="ingredient-card"]',
          'Краторная булка N-200i'
        ).within(() => {
          cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
        });
      });
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      });

      // Добавляем начинку
      cy.get('[data-cy="burger-ingredients"]').within(() => {
        cy.contains(
          '[data-cy="ingredient-card"]',
          'Биокотлета из марсианской Магнолии'
        ).within(() => {
          cy.get('[data-cy="ingredient-add"]').contains('Добавить').click();
        });
      });
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      });

      // Кликаем на кнопку оформления заказа
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.contains('Оформить заказ').click();
      });

      // Проверяем, что отправлен запрос на создание заказа
      cy.wait('@createOrder', { timeout: 10000 });

      // Проверяем отображение модального окна с номером заказа
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('12345', { timeout: 10000 }).should('be.visible');
        cy.contains('идентификатор заказа').should('be.visible');
      });

      // Закрываем модальное окно
      cy.get('[data-cy="modal"]').within(() => {
        cy.get('button').first().click();
      });

      // Проверяем, что конструктор очищен
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');
        cy.contains('Краторная булка N-200i (верх)').should('not.exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
      });
    });
  });
});
