describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.visit('/');
    cy.wait('@getIngredients');
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
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });

  it('должна добавляться булка в конструктор при клике на кнопку "Добавить"', () => {
    // Находим первую булку и кликаем на кнопку "Добавить"
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
    
    // Проверяем, что булка добавлена в конструктор
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('должна добавляться начинка в конструктор при клике на кнопку "Добавить"', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
    
    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').click();
    
    // Проверяем, что начинка добавлена
    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
  });

  it('должна отображаться цена заказа', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
    
    // Проверяем наличие цены (цена булки * 2)
    cy.contains('2510').should('be.visible');
  });

  it('кнопка "Оформить заказ" должна быть видима', () => {
    cy.contains('Оформить заказ').should('be.visible');
  });

  it('при клике на "Оформить заказ" без авторизации должен происходить редирект на страницу входа', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
    
    // Кликаем на кнопку оформления заказа
    cy.contains('Оформить заказ').click();
    
    // Проверяем редирект на страницу входа
    cy.url().should('include', '/login');
  });

  it('должен открываться модальный ингредиент при клике на ингредиент', () => {
    // Кликаем на ингредиент (не на кнопку "Добавить")
    cy.contains('Краторная булка N-200i').click();
    
    // Проверяем открытие модального окна с деталями ингредиента
    cy.get('[class*="modal"]').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
    
    // Проверяем отображение деталей ингредиента
    cy.contains('Калории').should('be.visible');
    cy.contains('420').should('be.visible');
    cy.contains('Белки').should('be.visible');
    cy.contains('80').should('be.visible');
    cy.contains('Жиры').should('be.visible');
    cy.contains('24').should('be.visible');
    cy.contains('Углеводы').should('be.visible');
    cy.contains('53').should('be.visible');
  });

  it('должен закрываться модальный ингредиент при клике на крестик', () => {
    // Открываем модальное окно
    cy.contains('Краторная булка N-200i').click();
    cy.get('[class*="modal"]').should('be.visible');
    
    // Закрываем модальное окно через кнопку закрытия
    cy.get('[class*="modal"]').within(() => {
      cy.get('button').first().click();
    });
    
    // Проверяем, что модальное окно закрыто
    cy.get('[class*="modal"]').should('not.exist');
  });

  it('должен закрываться модальный ингредиент при клике на overlay', () => {
    // Открываем модальное окно
    cy.contains('Краторная булка N-200i').click();
    cy.get('[class*="modal"]').should('be.visible');
    
    // Кликаем на overlay (вне модального окна)
    cy.get('body').click(0, 0);
    
    // Проверяем, что модальное окно закрыто
    cy.get('[class*="modal"]').should('not.exist');
  });

  it('должна обновляться цена при добавлении ингредиентов', () => {
    // Добавляем булку (цена 1255 * 2 = 2510)
    cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
    cy.contains('2510').should('be.visible');
    
    // Добавляем начинку (цена 424)
    cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').click();
    
    // Проверяем обновленную цену (2510 + 424 = 2934)
    cy.contains('2934').should('be.visible');
  });

  describe('Процесс создания заказа', () => {
    beforeEach(() => {
      // Устанавливаем фейковые токены авторизации
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      });
      cy.setCookie('accessToken', 'fake-access-token');
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
      cy.contains('Краторная булка N-200i').parent().find('button').contains('Добавить').click();
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      
      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').contains('Добавить').click();
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      
      // Кликаем на кнопку оформления заказа
      cy.contains('Оформить заказ').click();
      
      // Проверяем, что отправлен запрос на создание заказа
      cy.wait('@createOrder');
      
      // Проверяем отображение модального окна с номером заказа
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('12345').should('be.visible');
      
      // Закрываем модальное окно
      cy.get('[class*="modal"]').within(() => {
        cy.get('button').first().click();
      });
      
      // Проверяем, что конструктор очищен
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
    });
  });
});

