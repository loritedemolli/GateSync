using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GateSync.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNeighborhood : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residences_Cities_CityId",
                table: "Residences");

            migrationBuilder.AlterColumn<int>(
                name: "CityId",
                table: "Residences",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "NeighborhoodId",
                table: "Residences",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Neighborhoods",
                columns: table => new
                {
                    NeighborhoodId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Neighborhoods", x => x.NeighborhoodId);
                    table.ForeignKey(
                        name: "FK_Neighborhoods_Cities_CityId",
                        column: x => x.CityId,
                        principalTable: "Cities",
                        principalColumn: "CityId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Residences_NeighborhoodId",
                table: "Residences",
                column: "NeighborhoodId");

            migrationBuilder.CreateIndex(
                name: "IX_Neighborhoods_CityId",
                table: "Neighborhoods",
                column: "CityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Residences_Cities_CityId",
                table: "Residences",
                column: "CityId",
                principalTable: "Cities",
                principalColumn: "CityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Residences_Neighborhoods_NeighborhoodId",
                table: "Residences",
                column: "NeighborhoodId",
                principalTable: "Neighborhoods",
                principalColumn: "NeighborhoodId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residences_Cities_CityId",
                table: "Residences");

            migrationBuilder.DropForeignKey(
                name: "FK_Residences_Neighborhoods_NeighborhoodId",
                table: "Residences");

            migrationBuilder.DropTable(
                name: "Neighborhoods");

            migrationBuilder.DropIndex(
                name: "IX_Residences_NeighborhoodId",
                table: "Residences");

            migrationBuilder.DropColumn(
                name: "NeighborhoodId",
                table: "Residences");

            migrationBuilder.AlterColumn<int>(
                name: "CityId",
                table: "Residences",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Residences_Cities_CityId",
                table: "Residences",
                column: "CityId",
                principalTable: "Cities",
                principalColumn: "CityId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
