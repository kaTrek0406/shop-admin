from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Разрешение только для чтения для всех пользователей,
    но полный доступ только для администраторов
    """

    def has_permission(self, request, view):
        # Разрешаем GET, HEAD, OPTIONS для всех
        if request.method in permissions.SAFE_METHODS:
            return True

        # Для остальных методов проверяем, является ли пользователь админом
        return request.user and request.user.is_authenticated and request.user.is_admin
